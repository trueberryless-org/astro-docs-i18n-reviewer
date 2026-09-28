const FRONTMATTER_DELIMITER = "---";
const FENCE_OPENING_RE = /^\s*(`{3,}(?!.*`)|~{3,})(\S*)/;
const FENCE_CLOSING_RE = /^\s*(`+|~+)\s*$/;
const FENCE_LANGUAGE_INVALID_CHARACTERS_RE = /[^a-z0-9]/g;

export function getMarkdownLines(content: string): MarkdownLine[] {
  const lines: MarkdownLine[] = [];
  let fence: Fence | undefined;
  let isInFrontmatter = false;

  for (const [index, text] of content.split("\n").entries()) {
    const line = index + 1;

    if (line === 1 && text.trim() === FRONTMATTER_DELIMITER) {
      isInFrontmatter = true;
      lines.push({ kind: "frontmatter", line, text });
      continue;
    }

    if (isInFrontmatter) {
      if (text.trim() === FRONTMATTER_DELIMITER) isInFrontmatter = false;
      lines.push({ kind: "frontmatter", line, text });
      continue;
    }

    if (fence) {
      if (isClosingFence(text, fence)) {
        fence = undefined;
        lines.push({ kind: "fence", line, text });
      } else {
        lines.push({ kind: "code", language: fence.language, line, text });
      }
      continue;
    }

    fence = parseOpeningFence(text);
    lines.push({ kind: fence ? "fence" : "text", line, text });
  }

  return lines;
}

function parseOpeningFence(text: string): Fence | undefined {
  const [, marker, info] = FENCE_OPENING_RE.exec(text) ?? [];
  if (!marker) return;

  return {
    character: marker.charAt(0),
    language: normalizeFenceLanguage(info ?? ""),
    length: marker.length,
  };
}

function isClosingFence(text: string, fence: Fence) {
  const [, marker] = FENCE_CLOSING_RE.exec(text) ?? [];

  return (
    marker !== undefined &&
    marker.charAt(0) === fence.character &&
    marker.length >= fence.length
  );
}

function normalizeFenceLanguage(info: string) {
  return info.toLowerCase().replace(FENCE_LANGUAGE_INVALID_CHARACTERS_RE, "");
}

interface Fence {
  character: string;
  language: string;
  length: number;
}

export type MarkdownLine =
  | { kind: "code"; language: string; line: number; text: string }
  | { kind: "fence" | "frontmatter" | "text"; line: number; text: string };
