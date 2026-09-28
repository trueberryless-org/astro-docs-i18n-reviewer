import { describe, expect, test } from "vitest";

import { reviewTranslationFile } from "../../libs/review";
import { LANGUAGES } from "../../rules";

const ruleset = LANGUAGES.get("de");

describe("reviewTranslationFile", () => {
  test("passes a clean translation", () => {
    if (!ruleset) throw new Error("Missing German ruleset.");

    expect(
      reviewTranslationFile({
        originalContent: "## Hello",
        patch: undefined,
        path: "src/content/docs/de/index.md",
        ruleset,
        translatedContent: "## Hallo",
      }),
    ).toEqual({
      comments: [],
      filename: "src/content/docs/de/index.md",
      guideUrl: ruleset.guideUrl,
      status: "passed",
    });
  });

  test("skips structure checks without an original file", () => {
    if (!ruleset) throw new Error("Missing German ruleset.");

    const report = reviewTranslationFile({
      originalContent: undefined,
      patch: undefined,
      path: "src/content/docs/de/index.md",
      ruleset,
      translatedContent: "## Hallo\n\nMit Github.",
    });

    expect(report.status).toBe("failed");
    expect(report.comments).toHaveLength(1);
  });
});
