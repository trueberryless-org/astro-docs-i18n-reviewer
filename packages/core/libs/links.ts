import { getMarkdownLines } from "./markdown";
import type { ReviewComment } from "./types";

const LINK_URL_RE = /(?:\]\(|\bhref=["'])([^)\s"']+)/g;
const HEADING_RE = /^#{1,6}\s+(.*?)\s*$/;
const CUSTOM_HEADING_ID_RE = /\s*\{#([^}]+)\}$/;
const ID_ATTRIBUTE_RE = /\bid=["']([^"']+)["']/g;
const MARKDOWN_LINK_RE = /\[([^\]]*)\]\([^)]*\)/g;
const SLUG_INVALID_CHARACTER_RE = /[^\p{L}\p{M}\p{N} _-]/gu;
const HTML_ENTITIES = new Map([
  ["&amp;", "&"],
  ["&nbsp;", " "],
  ["&shy;", "­"],
]);
const HTML_ENTITY_RE = /&(?:amp|nbsp|shy);/g;
const PATH_SUFFIX_RE = /[?#]/;

const MDN_ENGLISH_URL = "https://developer.mozilla.org/en-US/";

export function getLinkComments(
  content: string,
  strippedContent: string,
  options: LinkCommentOptions
): ReviewComment[] {
  const { addedLines, path } = options;
  const lines = content.split("\n");
  const anchors = getAnchors(content);
  const issues = new Map<LinkIssueKind, LinkIssue[]>();

  for (const [index, text] of strippedContent.split("\n").entries()) {
    const line = index + 1;
    if (addedLines && !addedLines.has(line)) continue;

    for (const match of text.matchAll(LINK_URL_RE)) {
      const [, url] = match;
      if (!url) continue;

      const issue = getLinkIssue(url, anchors, options);
      if (!issue) continue;

      const column = (match.index ?? 0) + match[0].length - url.length;
      const issuesOfKind = issues.get(issue.kind) ?? [];
      issuesOfKind.push({ ...issue, column, line, url });
      issues.set(issue.kind, issuesOfKind);
    }
  }

  return [...issues.values()].flatMap((issuesOfKind) => {
    const [issue] = issuesOfKind;
    if (!issue) return [];

    return [
      {
        body: getLinkIssueBody(lines, issue, issuesOfKind.length),
        line: issue.line,
        path,
      },
    ];
  });
}

export function slugifyHeading(heading: string) {
  return heading
    .replace(MARKDOWN_LINK_RE, "$1")
    .replace(HTML_ENTITY_RE, (entity) => HTML_ENTITIES.get(entity) ?? entity)
    .toLowerCase()
    .replace(SLUG_INVALID_CHARACTER_RE, "")
    .replaceAll(" ", "-");
}

function getLinkIssue(
  url: string,
  anchors: Set<string>,
  { locale, locales, mdnLocale, siteUrl }: LinkCommentOptions
): Omit<LinkIssue, "column" | "line" | "url"> | undefined {
  if (mdnLocale && url.startsWith(MDN_ENGLISH_URL)) {
    return {
      fixedUrl: url.replace(
        MDN_ENGLISH_URL,
        `https://developer.mozilla.org/${mdnLocale}/`
      ),
      kind: "mdn",
      message: `MDN is available in this language — link to the localized page using \`/${mdnLocale}/\` instead of \`/en-US/\`.`,
    };
  }

  if (url.startsWith("#")) {
    const anchor = safeDecodeURIComponent(url.slice(1));

    return anchor && !anchors.has(anchor)
      ? {
          kind: "anchor",
          message: `The link fragment \`${url}\` doesn't match any heading in this page — update it to the anchor of the translated heading.`,
        }
      : undefined;
  }

  const isAbsolute = url.startsWith(`${siteUrl}/`);
  const pathname = isAbsolute ? url.slice(siteUrl.length) : url;
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return;

  const [path = "", suffix = ""] = splitPathname(pathname);
  const segments = path.split("/");
  if (segments.at(-1)?.includes(".")) return;

  const [, firstSegment = ""] = segments;
  const isLocalized = firstSegment === locale;
  const localizedPath = isLocalized
    ? path
    : locales.has(firstSegment)
      ? `/${locale}${path.slice(firstSegment.length + 1)}`
      : `/${locale}${path}`;
  const fixedUrl = `${ensureTrailingSlash(localizedPath)}${suffix}`;

  if (isAbsolute) {
    return {
      fixedUrl,
      kind: "absolute",
      message: `Use a relative link starting with \`/${locale}/\` instead of the full \`${siteUrl}\` URL.`,
    };
  }

  if (!isLocalized) {
    return {
      fixedUrl,
      kind: "locale",
      message: locales.has(firstSegment)
        ? `Internal link to \`/${firstSegment}/\` found — please update it to \`/${locale}/\`.`
        : `Internal link \`${path}\` doesn't start with \`/${locale}/\` — please link to the translated page.`,
    };
  }

  if (!path.endsWith("/")) {
    return {
      fixedUrl,
      kind: "trailing-slash",
      message: "Internal links need a trailing slash.",
    };
  }

  return;
}

function getLinkIssueBody(lines: string[], issue: LinkIssue, count: number) {
  let body = issue.message;

  if (count > 1) {
    body += ` This occurs ${count} times in the changed lines.`;
  }

  if (issue.fixedUrl !== undefined) {
    const line = lines[issue.line - 1] ?? "";
    const suggestedLine = `${line.slice(0, issue.column)}${issue.fixedUrl}${line.slice(issue.column + issue.url.length)}`;

    if (suggestedLine !== line) {
      body += `\n\n\`\`\`suggestion\n${suggestedLine}\n\`\`\``;
    }
  }

  return body;
}

function getAnchors(content: string) {
  const anchors = new Set<string>();
  const slugCounts = new Map<string, number>();

  for (const { kind, text } of getMarkdownLines(content)) {
    if (kind !== "text") continue;

    for (const [, id] of text.matchAll(ID_ATTRIBUTE_RE)) {
      if (id) anchors.add(id);
    }

    const [, heading] = HEADING_RE.exec(text) ?? [];
    if (heading === undefined) continue;

    const [, customId] = CUSTOM_HEADING_ID_RE.exec(heading) ?? [];
    if (customId) {
      anchors.add(customId);
      continue;
    }

    const slug = slugifyHeading(heading);
    const count = slugCounts.get(slug) ?? 0;

    slugCounts.set(slug, count + 1);
    anchors.add(count === 0 ? slug : `${slug}-${count}`);
  }

  return anchors;
}

function splitPathname(pathname: string) {
  const index = pathname.search(PATH_SUFFIX_RE);

  return index === -1
    ? [pathname, ""]
    : [pathname.slice(0, index), pathname.slice(index)];
}

function ensureTrailingSlash(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}

function safeDecodeURIComponent(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

interface LinkCommentOptions {
  addedLines: Set<number> | undefined;
  locale: string;
  locales: Set<string>;
  mdnLocale?: string | undefined;
  path: string;
  siteUrl: string;
}

type LinkIssueKind =
  "absolute" | "anchor" | "locale" | "mdn" | "trailing-slash";

interface LinkIssue {
  column: number;
  fixedUrl?: string;
  kind: LinkIssueKind;
  line: number;
  message: string;
  url: string;
}
