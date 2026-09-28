import { describe, expect, test } from "vitest";

import {
  getRuleComments,
  getRuleMatches,
  matchWord,
} from "../../libs/rules";
import { stripNonProseContent } from "../../libs/strip";
import { commonPatterns } from "../../rules";

const pattern = {
  message: "Wrong capitalisation — write `GitHub`.",
  regex: /\bGithub\b/g,
  suggestion: "GitHub",
};

describe("getRuleMatches", () => {
  test("returns the line and column of each match", () => {
    expect(getRuleMatches("a\nb Github", /Github/g)).toEqual([
      { column: 2, line: 2, text: "Github" },
    ]);
  });

  test("supports non-global regexes", () => {
    expect(getRuleMatches("Github Github", /Github/)).toHaveLength(2);
  });
});

describe("getRuleComments", () => {
  test("suggests replacing the match at its position in the line", () => {
    const content = "Use `Github` or Github.";

    const [comment] = getRuleComments(
      content,
      stripNonProseContent(content),
      [pattern],
      { addedLines: undefined, path: "file.md" },
    );

    expect(comment?.body).toContain(
      "```suggestion\nUse `Github` or GitHub.\n```",
    );
  });

  test("ignores matches outside the added lines", () => {
    const content = "Github\nGithub";

    const comments = getRuleComments(content, content, [pattern], {
      addedLines: new Set([2]),
      path: "file.md",
    });

    expect(comments).toHaveLength(1);
    expect(comments[0]?.line).toBe(2);
  });

  test("counts multiple occurrences", () => {
    const content = "Github Github";

    const [comment] = getRuleComments(content, content, [pattern], {
      addedLines: undefined,
      path: "file.md",
    });

    expect(comment?.body).toContain("occurs 2 times");
  });
});


describe("matchWord", () => {
  test("matches whole words containing non-ASCII letters", () => {
    const regex = matchWord("wdrożyć");

    expect("Możesz wdrożyć stronę.".match(regex)).toEqual(["wdrożyć"]);
    expect("przedwdrożyć".match(regex)).toBeNull();
  });

  test("matches words in non-Latin scripts", () => {
    expect("फ़ाइल को खोलें".match(matchWord("फ़ाइल"))).toEqual(["फ़ाइल"]);
    expect("फ़ाइलों".match(matchWord("फ़ाइल"))).toBeNull();
  });
});

describe("commonPatterns", () => {
  test("reports translated aside types in any language", () => {
    const content = [":::tip[Título]", ":::consejo", "::::注意", ":::note", ":::"].join("\n");

    const comments = getRuleComments(content, content, commonPatterns, {
      addedLines: undefined,
      path: "file.md",
    });

    expect(comments).toHaveLength(1);
    expect(comments[0]?.line).toBe(2);
    expect(comments[0]?.body).toContain("occurs 2 times");
  });
});
