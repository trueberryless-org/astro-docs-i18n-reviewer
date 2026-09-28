import { type MarkdownLine, getMarkdownLines } from "./markdown";

const NON_NEWLINE_CHARACTER_RE = /[^\n]/g;
const FENCE_INFO_RE = /^(\s*(?:`{3,}|~{3,})\S*)(.*)$/;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const HTML_TAG_RE = /<[a-zA-Z!/?][^>]*>/g;
const JSX_EXPRESSION_RE = /\{[^{}]*\}/g;
const MARKDOWN_LINK_RE = /\[([^\]\n]*)\]\(([^)\n]*)\)/g;
const MDX_IMPORT_RE = /^\s*import\s+.+\s+from\s+['"`][^'"`]*['"`];?\s*$/gm;

export function stripNonLinkContent(content: string) {
  return stripMdxImports(stripHtmlTags(stripCodeBlocks(content)));
}

export function stripNonProseContent(content: string) {
  return stripMarkdownLinkUrls(stripNonLinkContent(content));
}

function stripCodeBlocks(content: string) {
  return getMarkdownLines(content).map(stripCodeFromLine).join("\n");
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
  return content.replace(HTML_TAG_RE, blank).replace(JSX_EXPRESSION_RE, blank);
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
