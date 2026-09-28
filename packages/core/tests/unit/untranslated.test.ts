import { describe, expect, test } from "vitest";

import { getUntranslatedContentComments } from "../../libs/untranslated";

const prose =
  "This paragraph explains how routing works in an Astro project in detail.";
const comment = "// This comment explains what the following code does";

describe("getUntranslatedContentComments", () => {
  test("reports prose and code comments identical to the original", () => {
    const content = ["# Title", "", prose, "", "```js", comment, "```"].join(
      "\n",
    );

    const comments = getUntranslatedContentComments(
      content,
      content,
      "file.md",
      undefined,
    );

    expect(comments.map(({ line }) => line)).toEqual([3, 6]);
  });

  test("ignores lines outside the added lines", () => {
    expect(
      getUntranslatedContentComments(prose, prose, "file.md", new Set([2])),
    ).toEqual([]);
  });

  test("ignores short lines", () => {
    expect(
      getUntranslatedContentComments(
        "Short line.",
        "Short line.",
        "file.md",
        undefined,
      ),
    ).toEqual([]);
  });
});
