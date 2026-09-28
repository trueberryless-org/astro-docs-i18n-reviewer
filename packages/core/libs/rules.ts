import type { ReviewComment, RulePattern } from "./types";

export function matchWord(source: string, flags = "giu") {
  return new RegExp(
    `(?<![\\p{L}\\p{M}\\p{N}_])(?:${source})(?![\\p{L}\\p{M}\\p{N}_])`,
    flags
  );
}

export function getRuleComments(
  content: string,
  strippedContent: string,
  patterns: RulePattern[],
  options: RuleCommentOptions
): ReviewComment[] {
  const { addedLines, path } = options;

  return patterns.flatMap((pattern) => {
    const matches = getRuleMatches(strippedContent, pattern.regex).filter(
      ({ line }) => !addedLines || addedLines.has(line)
    );

    const [firstMatch] = matches;
    if (!firstMatch) return [];

    return [
      {
        body: getRuleCommentBody(content, pattern, firstMatch, matches.length),
        line: firstMatch.line,
        path,
      },
    ];
  });
}

export function getRuleMatches(content: string, regex: RegExp): RuleMatch[] {
  const globalRegex = regex.flags.includes("g")
    ? new RegExp(regex)
    : new RegExp(regex.source, `${regex.flags}g`);

  return [...content.matchAll(globalRegex)].map((match) => {
    const precedingLines = content.slice(0, match.index).split("\n");

    return {
      column: precedingLines.at(-1)?.length ?? 0,
      line: precedingLines.length,
      text: match[0],
    };
  });
}

function getRuleCommentBody(
  content: string,
  pattern: RulePattern,
  match: RuleMatch,
  matchCount: number
) {
  let body = pattern.message;

  if (matchCount > 1) {
    body += ` This phrase occurs ${matchCount} times in the changed lines.`;
  }

  if (pattern.suggestion !== undefined) {
    const line = content.split("\n")[match.line - 1] ?? "";
    const suggestedLine = replaceMatchInLine(line, match, pattern.suggestion);

    if (suggestedLine !== line) {
      body += `\n\n\`\`\`suggestion\n${suggestedLine}\n\`\`\``;
    }
  }

  return body;
}

function replaceMatchInLine(
  line: string,
  match: RuleMatch,
  suggestion: string
) {
  const { column, text } = match;

  return `${line.slice(0, column)}${suggestion}${line.slice(column + text.length)}`;
}

interface RuleCommentOptions {
  addedLines: Set<number> | undefined;
  path: string;
}

interface RuleMatch {
  column: number;
  line: number;
  text: string;
}
