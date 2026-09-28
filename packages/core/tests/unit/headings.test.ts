import { describe, expect, test } from "vitest";

import {
  getHeadingStructureComments,
  getHeadings,
} from "../../libs/headings";

describe("getHeadings", () => {
  test("returns headings with their level and line", () => {
    expect(getHeadings("# Title\n\n## Section\n\n### Sub")).toEqual([
      { level: 1, line: 1 },
      { level: 2, line: 3 },
      { level: 3, line: 5 },
    ]);
  });

  test("ignores frontmatter", () => {
    expect(getHeadings("---\n# not: a heading\n---\n## Section")).toEqual([
      { level: 2, line: 4 },
    ]);
  });

  test("ignores comments in indented code blocks", () => {
    const content = [
      "## Install",
      "",
      "1. Run the command:",
      "",
      "   ```sh",
      "   # install the dependencies",
      "   npm install",
      "   ```",
    ].join("\n");

    expect(getHeadings(content)).toEqual([{ level: 2, line: 1 }]);
  });

  test("does not treat inline code at the start of a line as a fence", () => {
    const content = ["```foo``` is inline code", "", "## Section"].join("\n");

    expect(getHeadings(content)).toEqual([{ level: 2, line: 3 }]);
  });

  test("ignores comments after a nested fence of a shorter length", () => {
    const content = [
      "````md",
      "```sh",
      "```",
      "# not a heading",
      "````",
      "## Section",
    ].join("\n");

    expect(getHeadings(content)).toEqual([{ level: 2, line: 6 }]);
  });
});

describe("getHeadingStructureComments", () => {
  test("returns no comments for matching structures", () => {
    expect(
      getHeadingStructureComments("## A\n### B", "## X\n### Y", "file.md"),
    ).toEqual([]);
  });

  test("reports a missing subsection on the parent heading", () => {
    const comments = getHeadingStructureComments(
      "## A\n### B\n### C",
      "## X\n### Y",
      "file.md",
    );

    expect(comments).toHaveLength(1);
    expect(comments[0]?.line).toBe(1);
    expect(comments[0]?.body).toContain("under this `h2` section");
  });
});
