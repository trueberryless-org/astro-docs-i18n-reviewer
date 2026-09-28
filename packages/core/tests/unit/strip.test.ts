import { describe, expect, test } from "vitest";

import { stripCodeContent, stripNonProseContent } from "../../libs/strip";

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

describe("stripCodeContent", () => {
  test("keeps link URLs and HTML attributes", () => {
    expect(stripCodeContent('[link](/en/guide/) <a href="/en/">')).toBe(
      '[link](/en/guide/) <a href="/en/">'
    );
  });
});

describe("stripNonProseContent with non-prose Markdown", () => {
  test("blanks frontmatter values except translatable ones", () => {
    const stripped = stripNonProseContent(
      ["---", "title: Integrations", "type: integration", "sidebar:", "  label: Integrations", "---"].join("\n")
    ).split("\n");

    expect(stripped[1]?.trim()).toBe("Integrations");
    expect(stripped[2]?.trim()).toBe("");
    expect(stripped[4]?.trim()).toBe("Integrations");
  });

  test("blanks file names, URLs, reference labels and error messages", () => {
    const stripped = stripNonProseContent(
      [
        "Edit package.json and i18n.routing, see https://example.com/components.",
        "Use the [integration][astro-integration].",
        "[astro-integration]: /en/guides/integrations/",
        "> **NoClientEntrypoint**: `X` component has no client entrypoint.",
        "Join the #integrations channel and use astro:actions.",
      ].join("\n")
    );

    expect(stripped).not.toMatch(
      /package|routing|components|astro-integration|entrypoint|integrations|actions/
    );
    expect(stripped).toContain("[integration]");
  });

  test("blanks code blocks opened on a list item line", () => {
    expect(stripNonProseContent('1.  ```md title="page.md"\n    "quoted"\n    ```')).not.toContain("quoted");
  });
});
