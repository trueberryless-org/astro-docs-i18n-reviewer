import { getMarkdownLines } from "./markdown";
import type { ReviewComment } from "./types";

const HTML_TAG_RE = /<[^>]*>/g;
const HEADING_RE = /^(#{1,6})\s/;

export function getHeadingStructureComments(
  originalContent: string,
  translatedContent: string,
  path: string
): ReviewComment[] {
  const originalTree = buildHeadingTree(getHeadings(originalContent));
  const translatedTree = buildHeadingTree(getHeadings(translatedContent));

  return compareHeadingTrees(originalTree, translatedTree, path);
}

export function getHeadings(content: string): Heading[] {
  const headings: Heading[] = [];

  for (const { kind, line, text } of getMarkdownLines(content)) {
    if (kind !== "text") continue;

    const [, hashes] = HEADING_RE.exec(text.replace(HTML_TAG_RE, "")) ?? [];
    if (hashes) headings.push({ level: hashes.length, line });
  }

  return headings;
}

function buildHeadingTree(headings: Heading[]): HeadingNode {
  const root: HeadingNode = { children: [], level: 0, line: 0 };
  const stack: [HeadingNode, ...HeadingNode[]] = [root];

  for (const { level, line } of headings) {
    const node: HeadingNode = { children: [], level, line };

    while (stack.length > 1 && getLast(stack).level >= level) stack.pop();

    getLast(stack).children.push(node);
    stack.push(node);
  }

  return root;
}

function compareHeadingTrees(
  original: HeadingNode,
  translated: HeadingNode,
  path: string
): ReviewComment[] {
  if (original.children.length !== translated.children.length) {
    return [getHeadingMismatchComment(original, translated, path)];
  }

  return original.children.flatMap((originalChild, index) => {
    const translatedChild = translated.children[index];

    return translatedChild
      ? compareHeadingTrees(originalChild, translatedChild, path)
      : [];
  });
}

function getHeadingMismatchComment(
  original: HeadingNode,
  translated: HeadingNode,
  path: string
): ReviewComment {
  const childLevel =
    original.children[0]?.level ?? translated.children[0]?.level;
  const levelLabel = childLevel ? `\`h${childLevel}\`` : "sub-heading";
  const location =
    translated.level > 0
      ? `under this \`h${translated.level}\` section`
      : "at the top level of this file";

  return {
    body:
      `Heading structure mismatch: the original English file has **${original.children.length}** ${levelLabel} subsection(s) ${location}, ` +
      `but this translation has **${translated.children.length}**. Please check for missing or extra headings.`,
    line: translated.line > 0 ? translated.line : 1,
    path,
  };
}

function getLast(stack: [HeadingNode, ...HeadingNode[]]) {
  return stack[stack.length - 1] ?? stack[0];
}

interface Heading {
  level: number;
  line: number;
}

interface HeadingNode extends Heading {
  children: HeadingNode[];
}
