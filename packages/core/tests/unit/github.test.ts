import { describe, expect, test } from "vitest";

import { decodeBase64, parsePullRequest } from "../../libs/github";

describe("parsePullRequest", () => {
  test("parses a pull request number", () => {
    const expected = { number: 1234, owner: "withastro", repo: "docs" };

    expect(parsePullRequest("1234")).toEqual(expected);
    expect(parsePullRequest(" #1234 ")).toEqual(expected);
  });

  test("parses a pull request URL", () => {
    expect(
      parsePullRequest("https://github.com/withastro/starlight/pull/42/files"),
    ).toEqual({ number: 42, owner: "withastro", repo: "starlight" });
  });

  test("throws for an invalid input", () => {
    expect(() => parsePullRequest("not a pull request")).toThrow(
      "Invalid pull request",
    );
  });
});

describe("decodeBase64", () => {
  test("decodes UTF-8 content", () => {
    expect(decodeBase64("w6TDtsO8\n4pyF")).toBe("äöü✅");
  });
});
