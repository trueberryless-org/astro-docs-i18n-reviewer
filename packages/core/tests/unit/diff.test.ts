import { describe, expect, test } from "vitest";

import { parseAddedLineNumbers } from "../../libs/diff";

describe("parseAddedLineNumbers", () => {
  test("returns the line numbers of added lines in the new file", () => {
    const patch = [
      "@@ -1,3 +1,4 @@",
      " unchanged",
      "-removed",
      "+added",
      "+added",
      " unchanged",
      "@@ -10,2 +11,2 @@",
      " unchanged",
      "+added",
      "\\ No newline at end of file",
    ].join("\n");

    expect([...parseAddedLineNumbers(patch)]).toEqual([2, 3, 12]);
  });
});
