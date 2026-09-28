import { getMarkdownLines } from "./markdown";
import type { ReviewComment } from "./types";

const HEADING_RE = /^#{1,6}\s/;
const IMPORT_RE = /^\s*import\s+.+\s+from\s+/;
const SLASH_COMMENT_RE = /^\s*\/\//;
const HASH_COMMENT_RE = /^\s*#/;
const COMMENT_MARKER_RE = /^\s*[/#+*-]+\s*/;
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\([^)]*\)/g;
const HTML_TAG_RE = /<[^>]+>/g;
const INLINE_CODE_RE = /`[^`]+`/g;
const WORD_SEPARATOR_RE = /\s+/;
const ALPHABETIC_WORD_RE = /[a-zA-Z]{3,}/;

const MIN_PROSE_LENGTH = 50;
const MIN_PROSE_WORDS = 4;
const MIN_CODE_COMMENT_LENGTH = 30;

const SLASH_COMMENT_LANGUAGES = new Set([
  "astro",
  "c",
  "cjs",
  "coffee",
  "cpp",
  "cs",
  "dart",
  "go",
  "groovy",
  "java",
  "js",
  "json5",
  "jsonc",
  "jsx",
  "kt",
  "mjs",
  "rs",
  "rust",
  "swift",
  "ts",
  "tsx",
]);
const HASH_COMMENT_LANGUAGES = new Set([
  "bash",
  "coffeescript",
  "fish",
  "perl",
  "pl",
  "py",
  "python",
  "r",
  "rb",
  "ruby",
  "sh",
  "shell",
  "toml",
  "yaml",
  "yml",
  "zsh",
]);

export function getUntranslatedContentComments(
  originalContent: string,
  translatedContent: string,
  path: string,
  addedLines: Set<number> | undefined
): ReviewComment[] {
  const isReviewable = (line: number) => !addedLines || addedLines.has(line);

  const originalProse = new Set(
    getProseLines(originalContent).map(({ text }) => text)
  );
  const untranslatedProse = getProseLines(translatedContent).filter(
    ({ line, text }) =>
      isLikelyProse(text) && originalProse.has(text) && isReviewable(line)
  );

  const originalCodeComments = new Set(
    getCodeCommentLines(originalContent).map(({ text }) => text)
  );
  const untranslatedCodeComments = getCodeCommentLines(
    translatedContent
  ).filter(
    ({ line, text }) =>
      isLikelyCodeComment(text) &&
      originalCodeComments.has(text) &&
      isReviewable(line)
  );

  return [
    ...untranslatedProse.map(({ line }) => ({
      body: "⚠️ This line appears untranslated — it is identical to the original English. Please translate it.",
      line,
      path,
    })),
    ...untranslatedCodeComments.map(({ line }) => ({
      body: "⚠️ This code comment appears untranslated — it is identical to the original English comment. Please translate it.",
      line,
      path,
    })),
  ];
}

export function getProseLines(content: string): ContentLine[] {
  return getMarkdownLines(content)
    .filter(
      ({ kind, text }) =>
        kind === "text" &&
        text.trim() !== "" &&
        !HEADING_RE.test(text) &&
        !IMPORT_RE.test(text)
    )
    .map(({ line, text }) => ({ line, text: text.trim() }));
}

export function getCodeCommentLines(content: string): ContentLine[] {
  return getMarkdownLines(content)
    .filter((line) => {
      if (line.kind !== "code") return false;

      return getCommentRegex(line.language)?.test(line.text) ?? false;
    })
    .map(({ line, text }) => ({ line, text: text.trim() }));
}

export function isLikelyProse(text: string) {
  if (text.length < MIN_PROSE_LENGTH) return false;

  const words = text
    .replace(MARKDOWN_LINK_RE, "$1")
    .replace(HTML_TAG_RE, "")
    .replace(INLINE_CODE_RE, "")
    .split(WORD_SEPARATOR_RE)
    .filter((word) => ALPHABETIC_WORD_RE.test(word));

  return words.length >= MIN_PROSE_WORDS;
}

function isLikelyCodeComment(text: string) {
  return (
    text.replace(COMMENT_MARKER_RE, "").trim().length >= MIN_CODE_COMMENT_LENGTH
  );
}

function getCommentRegex(language: string) {
  if (SLASH_COMMENT_LANGUAGES.has(language)) return SLASH_COMMENT_RE;
  if (HASH_COMMENT_LANGUAGES.has(language)) return HASH_COMMENT_RE;
  return;
}

interface ContentLine {
  line: number;
  text: string;
}
