import { type MarkdownLine, getMarkdownLines } from "./markdown";

const NON_NEWLINE_CHARACTER_RE = /[^\n]/g;
const FENCE_INFO_RE = /^(\s*(?:(?:[-*+]|\d+[.)])\s+)?(?:`{3,}|~{3,})\S*)(.*)$/;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const CODE_ELEMENT_RE = /<code>[^\n]*?<\/code>/g;
const HTML_TAG_RE = /<[a-zA-Z!/?][^>]*>/g;
const JSX_EXPRESSION_RE = /\{[^{}]*\}/g;
const MARKDOWN_LINK_RE = /\[([^\]\n]*)\]\(([^)\n]*)\)/g;
const MDX_IMPORT_RE = /^\s*import\s+.+\s+from\s+['"`][^'"`]*['"`];?\s*$/gm;
const LINK_REFERENCE_LABEL_RE = /\]\[([^\]\n]*)\]/g;
const LINK_REFERENCE_DEFINITION_RE = /^[ \t]*\[[^\]\n]+\]:[ \t]*\S.*$/gm;
const ERROR_MESSAGE_QUOTE_RE = /^[ \t]*>[ \t]*\*\*\w+\*\*:.*$/gm;
const PATH_TOKEN_RE = /(?<![^\s(["'])[\w.@~-]*\/[\w./@~-]*/g;
const BARE_URL_RE = /\bhttps?:\/\/[^\s)>\]"'`]+/g;
const CODE_IDENTIFIER_RE =
  /(?<![\p{L}\p{N}_$@/])[A-Za-z_$@][\w$@-]*(?:\.[a-z_$][\w$-]*)+/gu;
const HASHTAG_RE = /(?<![^\s(（])#[\w-]+/g;
const COLON_IDENTIFIER_RE = /(?<![\p{L}\p{N}_$@/:])[a-z][\w-]*:[a-z*][\w*-]*/gu;
const FRONTMATTER_ENTRY_RE = /^(\s*(?:-\s+)?)([\w-]+)(\s*:)(.*)$/;

const TRANSLATABLE_FRONTMATTER_KEYS = new Set([
  "alt",
  "content",
  "description",
  "label",
  "tagline",
  "text",
  "title",
  "unitTitle",
]);

export function stripCodeContent(content: string) {
  return stripMdxImports(stripCodeBlocks(content));
}

export function stripNonProseContent(content: string) {
  return stripMarkdownLinkUrls(stripHtmlTags(stripCodeContent(content)))
    .replace(LINK_REFERENCE_DEFINITION_RE, blank)
    .replace(
      LINK_REFERENCE_LABEL_RE,
      (_match, label: string) => `][${blank(label)}]`
    )
    .replace(ERROR_MESSAGE_QUOTE_RE, blank)
    .replace(BARE_URL_RE, blank)
    .replace(PATH_TOKEN_RE, blank)
    .replace(CODE_IDENTIFIER_RE, blank)
    .replace(COLON_IDENTIFIER_RE, blank)
    .replace(HASHTAG_RE, blank);
}

function stripCodeBlocks(content: string) {
  let isTranslatableFrontmatterValue = false;

  return getMarkdownLines(content)
    .map((line) => {
      if (line.kind !== "frontmatter") return stripCodeFromLine(line);

      const [, indentation = "", key, separator = "", value = ""] =
        FRONTMATTER_ENTRY_RE.exec(line.text) ?? [];

      if (key === undefined) {
        return isTranslatableFrontmatterValue ? line.text : blank(line.text);
      }

      isTranslatableFrontmatterValue = TRANSLATABLE_FRONTMATTER_KEYS.has(key);

      return isTranslatableFrontmatterValue
        ? `${blank(`${indentation}${key}${separator}`)}${value}`
        : blank(line.text);
    })
    .join("\n");
}

function stripCodeFromLine(line: MarkdownLine) {
  switch (line.kind) {
    case "code": {
      return blank(line.text);
    }
    case "fence": {
      return line.text.replace(
        FENCE_INFO_RE,
        (_match, fence: string, attributes: string) =>
          `${fence}${blank(attributes)}`
      );
    }
    default: {
      return line.text.replace(
        INLINE_CODE_RE,
        (code) => `\`${blank(code.slice(1, -1))}\``
      );
    }
  }
}

function stripHtmlTags(content: string) {
  return content
    .replace(CODE_ELEMENT_RE, blank)
    .replace(HTML_TAG_RE, blank)
    .replace(JSX_EXPRESSION_RE, blank);
}

function stripMarkdownLinkUrls(content: string) {
  return content.replace(
    MARKDOWN_LINK_RE,
    (_match, text: string, url: string) => `[${text}](${blank(url)})`
  );
}

function stripMdxImports(content: string) {
  return content.replace(MDX_IMPORT_RE, blank);
}

function blank(text: string) {
  return text.replace(NON_NEWLINE_CHARACTER_RE, " ");
}
