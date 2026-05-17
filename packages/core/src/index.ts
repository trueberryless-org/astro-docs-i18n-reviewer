import { Octokit } from "@octokit/core";
import {
  parsePRUrlOrNumber,
  fetchPRData,
  fetchRawContent,
  postGitHubReview,
} from "./github.js";
import {
  LANGUAGES,
  commonPatterns,
  extractLocaleFromPath,
  guessOriginalPath,
} from "./rules/index.js";
import type {
  ReviewOptions,
  TranslationReport,
  InlineComment,
} from "./types.js";

export { postGitHubReview };

/**
 * Blanks out fenced code blocks and inline code spans while preserving
 * newlines so line numbers remain accurate for rule matching.
 * Uses a line-by-line state machine — more reliable than a regex for
 * malformed or nested fences common in MDX docs.
 */
function stripCodeBlocks(content: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let inFenced = false;
  let fenceChar = "";
  let fenceLen = 0;

  for (const line of lines) {
    if (!inFenced) {
      const m = line.match(/^\s*(`{3,}|~{3,})/);
      if (m) {
        inFenced = true;
        fenceChar = m[1][0];
        fenceLen = m[1].length;
        // Blank everything after fence+lang (e.g. title="...") so rules never
        // fire on code-block attributes, preserving line length for accuracy.
        result.push(line.replace(/^(\s*(?:`{3,}|~{3,})\S*)(.*)/, (_, fenceLang, rest) => fenceLang + " ".repeat(rest.length)));
      } else {
        // Blank inline code spans, preserving length for line-number accuracy
        result.push(
          line.replace(/`[^`\n]+`/g, (m) => "`" + " ".repeat(m.length - 2) + "`"),
        );
      }
    } else {
      // A closing fence: same char, >= opening length, only whitespace after
      const cm = line.match(/^\s*(`+|~+)\s*$/);
      if (cm && cm[1][0] === fenceChar && cm[1].length >= fenceLen) {
        inFenced = false;
        result.push(line);
      } else {
        result.push(" ".repeat(line.length)); // blank content, preserve length
      }
    }
  }
  return result.join("\n");
}

/**
 * Blanks out HTML/JSX tags (including attribute values) and JSX curly-brace
 * expressions while preserving newlines. Prevents rules from firing on tag
 * names, attribute values, or component props — e.g. `<slot />` or
 * `<TabItem label="routing">` won't trigger translation rules.
 */
function stripHtmlTags(content: string): string {
  return content
    // Opening, closing, and self-closing tags — handles multi-line tags
    .replace(/<[a-zA-Z!/?][^>]*>/g, (m) => m.replace(/[^\n]/g, " "))
    // JSX expressions in curly braces (non-nested)
    .replace(/\{[^{}]*\}/g, (m) => m.replace(/[^\n]/g, " "));
}


/**
 * Blanks out the URL portion of inline markdown links `[text](url)` while
 * preserving the link text and all newlines. Prevents rules from firing on
 * URL slugs (e.g. `/ko/reference/구성-reference/`).
 */
function stripMarkdownLinkUrls(content: string): string {
  return content.replace(
    /\[([^\]\n]*)\]\(([^)\n]*)\)/g,
    (_match, text, url) => `[${text}](${" ".repeat(url.length)})`,
  );
}



/**
 * Blanks out MDX/ESM import lines (e.g. `import Foo from '~/components/Foo.astro'`)
 * so rules never fire on module paths or component names.
 */
function stripMdxImports(content: string): string {
  return content.replace(
    /^\s*import\s+.+\s+from\s+['"`][^'"`]*['"`];?\s*$/gm,
    (m) => " ".repeat(m.length),
  );
}



// ── Untranslated content detection ──────────────────────────────────────────

interface ContentLine { content: string; line: number; }

/** Returns comment-detecting regex for a given fenced code block language, or null. */
function getCommentRegex(lang: string): RegExp | null {
  const slash = new Set(["js","ts","jsx","tsx","astro","mjs","cjs","java","c","cpp","cs","go","rust","rs","swift","kt","groovy","dart","jsonc","json5"]);
  const hash  = new Set(["py","python","bash","sh","shell","zsh","yaml","yml","toml","rb","ruby","r","perl","pl","fish","coffee","coffeescript"]);
  if (slash.has(lang)) return /^\s*\/\//;
  if (hash.has(lang))  return /^\s*#/;
  return null;
}

/**
 * Walks the markdown and returns every non-code, non-frontmatter,
 * non-heading, non-empty line with its 1-based line number.
 */
function extractProseLines(content: string): ContentLine[] {
  const lines = content.split("\n");
  const result: ContentLine[] = [];
  let inFrontmatter = false, inCodeBlock = false;
  let fenceChar = "", fenceLen = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNum = i + 1;

    if (lineNum === 1 && raw.trim() === "---") { inFrontmatter = true; continue; }
    if (inFrontmatter) { if (raw.trim() === "---") inFrontmatter = false; continue; }

    const fm = raw.match(/^\s*(`{3,}|~{3,})/);
    if (fm) {
      if (!inCodeBlock) { inCodeBlock = true; fenceChar = fm[1][0]; fenceLen = fm[1].length; }
      else { const cm = raw.match(/^\s*(`+|~+)\s*$/); if (cm && cm[1][0] === fenceChar && cm[1].length >= fenceLen) inCodeBlock = false; }
      continue;
    }
    if (inCodeBlock || raw.trim() === "" || /^#{1,6}\s/.test(raw) || /^\s*import\s+.+\s+from\s+/.test(raw)) continue;
    result.push({ content: raw.trim(), line: lineNum });
  }
  return result;
}

/**
 * Walks the markdown and returns every comment line inside fenced code blocks,
 * tagged with the block's language and 1-based line number.
 */
function extractCodeCommentLines(content: string): ContentLine[] {
  const lines = content.split("\n");
  const result: ContentLine[] = [];
  let inFrontmatter = false, inCodeBlock = false;
  let fenceChar = "", fenceLen = 0, blockLang = "";

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineNum = i + 1;

    if (lineNum === 1 && raw.trim() === "---") { inFrontmatter = true; continue; }
    if (inFrontmatter) { if (raw.trim() === "---") inFrontmatter = false; continue; }

    const fm = raw.match(/^\s*(`{3,}|~{3,})(\S*)/);
    if (fm) {
      if (!inCodeBlock) {
        inCodeBlock = true; fenceChar = fm[1][0]; fenceLen = fm[1].length;
        blockLang = fm[2].toLowerCase().replace(/[^a-z0-9]/g, "");
      } else {
        const cm = raw.match(/^\s*(`+|~+)\s*$/);
        if (cm && cm[1][0] === fenceChar && cm[1].length >= fenceLen) { inCodeBlock = false; blockLang = ""; }
      }
      continue;
    }
    if (!inCodeBlock) continue;
    const commentRe = getCommentRegex(blockLang);
    if (commentRe?.test(raw)) result.push({ content: raw.trim(), line: lineNum });
  }
  return result;
}

/** True when a line is substantial prose worth checking for missing translations. */
function isLikelyProse(text: string): boolean {
  if (text.length < 50) return false;
  // Need at least 4 alphabetic words (strips links, inline code, HTML first)
  const words = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/`[^`]+`/g, "")
    .split(/\s+/)
    .filter((w) => /[a-zA-Z]{3,}/.test(w));
  return words.length >= 4;
}

/**
 * Detects content that looks identical to the original English file —
 * a strong signal the translator missed that section.
 * Checks both prose lines and comment lines inside code blocks.
 */
function detectUntranslatedContent(
  originalContent: string,
  translatedContent: string,
  filePath: string,
  addedLines: Set<number> | null,
): InlineComment[] {
  const comments: InlineComment[] = [];

  // ── Prose lines ────────────────────────────────────────────────────────────
  const origProseSet = new Set(extractProseLines(originalContent).map((l) => l.content));
  for (const { content, line } of extractProseLines(translatedContent)) {
    if (!isLikelyProse(content)) continue;
    if (!origProseSet.has(content)) continue;
    if (addedLines && !addedLines.has(line)) continue;
    comments.push({
      path: filePath,
      line,
      body: "⚠️ This line appears untranslated — it is identical to the original English. Please translate it.",
    });
  }

  // ── Code comment lines ─────────────────────────────────────────────────────
  const origCommentSet = new Set(extractCodeCommentLines(originalContent).map((l) => l.content));
  for (const { content, line } of extractCodeCommentLines(translatedContent)) {
    const text = content.replace(/^\s*[/#+*-]+\s*/, "").trim();
    if (text.length < 30) continue; // ignore trivially short comments
    if (!origCommentSet.has(content)) continue;
    if (addedLines && !addedLines.has(line)) continue;
    comments.push({
      path: filePath,
      line,
      body: "⚠️ This code comment appears untranslated — it is identical to the original English comment. Please translate it.",
    });
  }

  return comments;
}



/**
 * Extracts headings with their level and 1-based line number from raw markdown.
 * Skips frontmatter (between leading `---` delimiters) and fenced code blocks.
 */
function extractHeadings(content: string): Array<{ level: number; line: number }> {
  const lines = content.split("\n");
  const result: Array<{ level: number; line: number }> = [];
  let inFrontmatter = false;
  let inFencedBlock = false;
  let fenceChar = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    if (lineNum === 1 && line.trim() === "---") { inFrontmatter = true; continue; }
    if (inFrontmatter) { if (line.trim() === "---") inFrontmatter = false; continue; }

    const fenceMatch = line.match(/^(`{3,}|~{3,})/);
    if (fenceMatch) {
      if (!inFencedBlock) { inFencedBlock = true; fenceChar = fenceMatch[1][0]; }
      else if (line.startsWith(fenceChar.repeat(3))) inFencedBlock = false;
      continue;
    }
    if (inFencedBlock) continue;

    // Strip inline HTML so tags on the same line don't interfere
    const stripped = line.replace(/<[^>]*>/g, "");
    const m = stripped.match(/^(#{1,6})\s/);
    if (m) result.push({ level: m[1].length, line: lineNum });
  }
  return result;
}

interface HeadingNode {
  level: number;
  line: number; // line in the translated file (0 = virtual root)
  children: HeadingNode[];
}

function buildHeadingTree(headings: Array<{ level: number; line: number }>): HeadingNode {
  const root: HeadingNode = { level: 0, line: 0, children: [] };
  const stack: HeadingNode[] = [root];
  for (const h of headings) {
    const node: HeadingNode = { level: h.level, line: h.line, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return root;
}

/**
 * Recursively compares two heading trees by position.
 * When child counts differ under a section, reports at that section's line
 * in the translated file (or line 1 for top-level mismatches).
 */
function compareHeadingTrees(
  orig: HeadingNode,
  trans: HeadingNode,
  filePath: string,
): InlineComment[] {
  const comments: InlineComment[] = [];

  function compare(o: HeadingNode, t: HeadingNode): void {
    if (o.children.length !== t.children.length) {
      const reportLine = t.line > 0 ? t.line : 1;
      const childLevel =
        o.children[0]?.level ?? t.children[0]?.level;
      const levelStr = childLevel ? `\`h${childLevel}\`` : "sub-heading";
      const where =
        t.level > 0
          ? `under this \`h${t.level}\` section`
          : "at the top level of this file";
      comments.push({
        path: filePath,
        line: reportLine,
        body:
          `Heading structure mismatch: the original English file has **${o.children.length}** ${levelStr} subsection(s) ${where}, ` +
          `but this translation has **${t.children.length}**. Please check for missing or extra headings.`,
      });
      return; // don't recurse further into a mismatched subtree
    }
    for (let i = 0; i < o.children.length; i++) {
      compare(o.children[i], t.children[i]);
    }
  }

  compare(orig, trans);
  return comments;
}

function parseAddedLineNumbers(patch: string): Set<number> {
  const added = new Set<number>();
  let newLineNum = 0;
  for (const line of patch.split("\n")) {
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      newLineNum = parseInt(hunk[1], 10) - 1;
      continue;
    }
    if (line.startsWith("\\") || line.startsWith("+++")) continue;
    if (line.startsWith("+")) {
      added.add(++newLineNum);
    } else if (!line.startsWith("-")) {
      newLineNum++;
    }
  }
  return added;
}


export async function runTranslationReview(
  options: ReviewOptions,
): Promise<TranslationReport> {
  const details = parsePRUrlOrNumber(options.prUrlOrNumber);
  const octokit = new Octokit({ auth: options.githubToken });

  const { pr, files } = await fetchPRData(octokit, details);
  const allInlineComments: InlineComment[] = [];
  const allOutOfDiffComments: InlineComment[] = [];
  const fileReports: import("./types.js").FileCheckResult[] = [];
  const localesWithGuide = new Set<string>();
  const unsupportedLocales = new Set<string>();

  for (const file of files) {
    if (!file.filename.endsWith(".md") && !file.filename.endsWith(".mdx")) {
      continue;
    }

    const locale = extractLocaleFromPath(file.filename);
    if (locale === "en") continue;

    // Track files whose locale we don't have rules for, then skip them
    if (!LANGUAGES[locale]) {
      unsupportedLocales.add(locale);
      continue;
    }

    const fileComments: InlineComment[] = [];

    // Compute added lines early — needed for both rule filtering and in/out-of-diff split.
    // Falls back to null when GitHub can't generate a patch (very large files).
    const addedLines: Set<number> | null = file.patch
      ? parseAddedLineNumbers(file.patch)
      : null;

    const currentContent = await fetchRawContent(
      octokit,
      details.owner,
      details.repo,
      file.filename,
      pr.head.sha,
    );
    const originalContent = await fetchRawContent(
      octokit,
      details.owner,
      details.repo,
      guessOriginalPath(file.filename),
      pr.base.sha,
    );

    if (originalContent) {
      const origTree = buildHeadingTree(extractHeadings(originalContent));
      const transTree = buildHeadingTree(extractHeadings(currentContent));
      fileComments.push(...compareHeadingTrees(origTree, transTree, file.filename));
      fileComments.push(...detectUntranslatedContent(originalContent, currentContent, file.filename, addedLines));
    }

    const ruleset = LANGUAGES[locale];
    if (ruleset) {
      if (ruleset.guideUrl) localesWithGuide.add(locale);
      const contentToCheck = stripMdxImports(stripMarkdownLinkUrls(stripHtmlTags(stripCodeBlocks(currentContent))));

      const patterns = [...commonPatterns, ...(ruleset?.patterns ?? [])];
      for (const rule of patterns) {
        try {
          const flags = rule.regex.flags.includes("g")
            ? rule.regex.flags
            : rule.regex.flags + "g";
          const cleanRegex = new RegExp(rule.regex.source, flags);

          const allMatches = [...contentToCheck.matchAll(cleanRegex)];

          // Filter matches to those whose line was changed in the diff
          const matches = addedLines
            ? allMatches.filter((m) => {
                const lineNum = contentToCheck
                  .substring(0, m.index!)
                  .split("\n").length;
                return addedLines.has(lineNum);
              })
            : allMatches;

          if (matches.length > 0) {
            const firstMatch = matches[0];
            const lineNumber = contentToCheck
              .substring(0, firstMatch.index!)
              .split("\n").length;

            let body = rule.message;
            if (matches.length > 1) {
              body += ` This phrase occurs ${matches.length} times in the changed lines.`;
            }

            // Append a GitHub suggestion block so translators can one-click accept
            if (rule.suggestion) {
              const fileLines = currentContent.split("\n");
              const originalLine = fileLines[lineNumber - 1] ?? "";
              const suggestedLine = originalLine.replace(
                firstMatch[0],
                rule.suggestion,
              );
              if (suggestedLine !== originalLine) {
                body += `\n\n\`\`\`suggestion\n${suggestedLine}\n\`\`\``;
              }
            }

            fileComments.push({
              path: file.filename,
              line: lineNumber,
              body,
            });
          }
        } catch (regexError) {
          console.error(
            `Error executing rule for regex ${rule.regex}:`,
            regexError,
          );
        }
      }
    }

    // Split comments: those on diff lines become inline threads;
    // those outside the diff range are collected for the overview comment.
    const inDiff = fileComments.filter(
      (c) => !addedLines || addedLines.has(c.line),
    );
    const outOfDiff = fileComments.filter(
      (c) => addedLines !== null && !addedLines.has(c.line),
    );

    allInlineComments.push(...inDiff);
    allOutOfDiffComments.push(...outOfDiff);
    fileReports.push({
      filename: file.filename,
      status: fileComments.length === 0 ? "passed" : "failed",
      comments: fileComments,
    });
  }

  const guideLinks = [...localesWithGuide]
    .filter((l) => LANGUAGES[l]?.guideUrl)
    .map((l) => `[i18n guide](${LANGUAGES[l].guideUrl!})`);
  const guideRef =
    guideLinks.length > 0
      ? ` Please refer to our ${guideLinks.join(" and ")} for the full terminology reference.`
      : "";

  const hasComments = allInlineComments.length > 0;
  let reviewBody = hasComments
    ? `Thanks for your translation!\n\nI found a few suggestions to help align this translation with our style guidelines.${guideRef}`
    : `Thanks for your translation!\n\nLGTM 🎉`;

  if (allOutOfDiffComments.length > 0) {
    reviewBody += "\n\n#### Further potential improvements (outside diff range)\n\n";
    for (const c of allOutOfDiffComments) {
      // Strip suggestion code blocks — they don't make sense as prose bullet points
      const message = c.body.replace(/\n+```suggestion[\s\S]*?```/g, "").trim();
      reviewBody += `- **\`${c.path}\` line ${c.line}**: ${message}\n`;
    }
    reviewBody +=
      "\nThese are out of scope for this PR, so let's create follow-up PR(s) for them 👍";
  }
  
  reviewBody +=
    "\n\n<sub>Generated by [Astro Docs i18n Reviewer](https://astro-docs-i18n-reviewer.trueberryless.org) 🌍</sub>";

  return {
    prNumber: details.number,
    author: pr.user?.login || "unknown",
    reviewBody,
    inlineComments: allInlineComments,
    fileReports,
    unsupportedLocales: [...unsupportedLocales],
  };
}
