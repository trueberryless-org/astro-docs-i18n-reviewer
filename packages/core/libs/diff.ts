const HUNK_HEADER_RE = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/;

export function parseAddedLineNumbers(patch: string) {
  const addedLines = new Set<number>();
  let lineNumber = 0;

  for (const line of patch.split("\n")) {
    const [, hunkStart] = HUNK_HEADER_RE.exec(line) ?? [];

    if (hunkStart) {
      lineNumber = Number.parseInt(hunkStart, 10) - 1;
      continue;
    }

    if (line.startsWith("\\") || line.startsWith("+++")) continue;

    if (line.startsWith("+")) {
      lineNumber++;
      addedLines.add(lineNumber);
    } else if (!line.startsWith("-")) {
      lineNumber++;
    }
  }

  return addedLines;
}
