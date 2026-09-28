import { type MarkdownLine, getMarkdownLines } from "./markdown";
import type { ReviewComment } from "./types";

const BLOCK_SCALAR_INDICATOR_RE = /^[|>][+-]?$/;
const FRONTMATTER_KEY_RE = /^([^\s#:-][^:]*?)\s*:(.*)$/u;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const COMPONENT_RE = /<\/?([A-Z][\w.]*)/g;
const SLOT_RE = /\bslot=["']([^"']+)["']/g;
const QUOTED_VALUE_RE = /^(["'])(.*)\1$/;

const KNOWN_FRONTMATTER_KEYS = new Set([
  "banner",
  "category",
  "description",
  "draft",
  "editUrl",
  "featuredListing",
  "framework",
  "githubIntegrationURL",
  "githubURL",
  "head",
  "hero",
  "i18nReady",
  "lastUpdated",
  "layout",
  "logo",
  "next",
  "pagefind",
  "prev",
  "service",
  "sidebar",
  "slug",
  "stub",
  "supports",
  "tableOfContents",
  "template",
  "title",
  "type",
  "unitTitle",
]);

export function getStructureComments(
  originalContent: string,
  translatedContent: string,
  path: string,
  addedLines: Set<number> | undefined
): ReviewComment[] {
  const originalLines = getMarkdownLines(originalContent);
  const translatedLines = getMarkdownLines(translatedContent).filter(
    ({ line }) => !addedLines || addedLines.has(line)
  );

  return [
    ...getFrontmatterComments(originalLines, translatedLines, path),
    ...getUnknownNameComments(originalLines, translatedLines, path, {
      getNames: getComponentNames,
      getMessage: (name) =>
        `The component \`<${name}>\` doesn't exist in the original English page — don't translate component names.`,
    }),
    ...getUnknownNameComments(originalLines, translatedLines, path, {
      getNames: getSlotNames,
      getMessage: (name) =>
        `The slot name \`${name}\` doesn't exist in the original English page — don't translate slot names, only the slotted content.`,
    }),
  ];
}

function getFrontmatterComments(
  originalLines: MarkdownLine[],
  translatedLines: MarkdownLine[],
  path: string
): ReviewComment[] {
  const originalFrontmatter = getFrontmatterEntries(originalLines);
  const comments: ReviewComment[] = [];

  for (const { key, line, value } of getFrontmatterEntries(
    translatedLines
  ).values()) {
    if (!originalFrontmatter.has(key) && !KNOWN_FRONTMATTER_KEYS.has(key)) {
      comments.push({
        body: `The frontmatter property \`${key}\` doesn't exist in the original English page — don't translate frontmatter property names, only the values of \`title\` and \`description\`.`,
        line,
        path,
      });
      continue;
    }

    if (
      key === "description" &&
      value &&
      !BLOCK_SCALAR_INDICATOR_RE.test(value) &&
      value === originalFrontmatter.get(key)?.value
    ) {
      comments.push({
        body: "⚠️ The `description` appears untranslated — it is identical to the original English. Please translate it.",
        line,
        path,
      });
    }
  }

  return comments;
}

function getUnknownNameComments(
  originalLines: MarkdownLine[],
  translatedLines: MarkdownLine[],
  path: string,
  { getMessage, getNames }: UnknownNameOptions
): ReviewComment[] {
  const originalNames = new Set(
    originalLines.flatMap((line) => getNames(line))
  );
  const reportedNames = new Set<string>();
  const comments: ReviewComment[] = [];

  for (const translatedLine of translatedLines) {
    for (const name of getNames(translatedLine)) {
      if (originalNames.has(name) || reportedNames.has(name)) continue;

      reportedNames.add(name);
      comments.push({
        body: getMessage(name),
        line: translatedLine.line,
        path,
      });
    }
  }

  return comments;
}

function getFrontmatterEntries(lines: MarkdownLine[]) {
  const entries = new Map<string, FrontmatterEntry>();

  for (const { kind, line, text } of lines) {
    if (kind !== "frontmatter") continue;

    const [, key, value] = FRONTMATTER_KEY_RE.exec(text) ?? [];
    if (!key || entries.has(key)) continue;

    entries.set(key, {
      key,
      line,
      value: normalizeFrontmatterValue(value ?? ""),
    });
  }

  return entries;
}

function normalizeFrontmatterValue(value: string) {
  return value.trim().replace(QUOTED_VALUE_RE, "$2");
}

function getComponentNames({ kind, text }: MarkdownLine) {
  if (kind !== "text") return [];

  return [...text.replace(INLINE_CODE_RE, "").matchAll(COMPONENT_RE)].flatMap(
    ([, name]) => (name ? [name] : [])
  );
}

function getSlotNames({ kind, text }: MarkdownLine) {
  if (kind !== "text") return [];

  return [...text.replace(INLINE_CODE_RE, "").matchAll(SLOT_RE)].flatMap(
    ([, name]) => (name ? [name] : [])
  );
}

interface FrontmatterEntry {
  key: string;
  line: number;
  value: string;
}

interface UnknownNameOptions {
  getMessage: (name: string) => string;
  getNames: (line: MarkdownLine) => string[];
}
