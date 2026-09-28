import { describe, expect, test } from "vitest";

import { stripNonLinkContent, stripNonProseContent } from "../../libs/strip";

describe("stripNonProseContent", () => {
  test("preserves the length of every line", () => {
    const content = [
      "import Foo from '~/components/Foo.astro';",
      "Some `inline code` and a [link](/en/guide/).",
      '<TabItem label="routing">',
      "```js title=\"file.js\"",
      "const a = 1;",
      "```",
    ].join("\n");

    const stripped = stripNonProseContent(content);

    expect(stripped.split("\n").map((line) => line.length)).toEqual(
      content.split("\n").map((line) => line.length),
    );
  });

  test("preserves line breaks around MDX imports", () => {
    const content = [
      "---",
      "title: Title",
      "---",
      "",
      "import A from 'a';",
      "import B from 'b';",
      "",
      "Text",
    ].join("\n");

    const lines = stripNonProseContent(content).split("\n");

    expect(lines).toHaveLength(8);
    expect(lines[7]).toBe("Text");
  });

  test("blanks code, tags, link URLs and imports", () => {
    const stripped = stripNonProseContent(
      [
        "import Foo from 'foo';",
        "Text `code` [link](/url/) <b>bold</b>",
        "```js",
        "routing();",
        "```",
      ].join("\n"),
    );

    expect(stripped).not.toContain("Foo");
    expect(stripped).not.toContain("code");
    expect(stripped).not.toContain("/url/");
    expect(stripped).not.toContain("<b>");
    expect(stripped).not.toContain("routing");
    expect(stripped).toContain("[link]");
    expect(stripped).toContain("bold");
  });
});

describe("stripNonLinkContent", () => {
  test("keeps link URLs", () => {
    expect(stripNonLinkContent("[link](/en/guide/)")).toBe(
      "[link](/en/guide/)",
    );
  });
});
