import type { RulePattern } from "../libs/types";

/**
 * Rules that apply to every translation, regardless of locale.
 * These are checked in addition to locale-specific patterns.
 */
export const commonPatterns: RulePattern[] = [
  {
    regex:
      /^[ \t]*:{3,}(?!(?:note|tip|caution|danger)(?![\p{L}\p{N}]))\p{L}[^\s[{]*/gmu,
    message:
      "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
  },
  // ── Brand name capitalisation ────────────────────────────────────────────
  {
    regex: /\bGithub\b/g,
    message: "Wrong capitalisation — write `GitHub`.",
    suggestion: "GitHub",
  },
  {
    regex: /\bGitlab\b/g,
    message: "Wrong capitalisation — write `GitLab`.",
    suggestion: "GitLab",
  },
  {
    regex: /\bJavascript\b/g,
    message: "Wrong capitalisation — write `JavaScript`.",
    suggestion: "JavaScript",
  },
  {
    regex: /\bTypescript\b/g,
    message: "Wrong capitalisation — write `TypeScript`.",
    suggestion: "TypeScript",
  },
  {
    regex: /\bNPM\b/g,
    message: "Wrong capitalisation — write `npm`.",
    suggestion: "npm",
  },
  {
    regex: /\bNpm\b/g,
    message:
      "Wrong capitalisation — write `npm` (always lowercase, even at the start of a sentence — this is npm's official brand style).",
    suggestion: "npm",
  },
  {
    regex: /\bVSCode\b/g,
    message: "Wrong brand name — write `VS Code` (with a space).",
    suggestion: "VS Code",
  },
  {
    regex: /\bNode\.?JS\b/g,
    message: "Wrong capitalisation — write `Node.js`.",
    suggestion: "Node.js",
  },
  {
    regex: /(?<!X\s+)\bTwitter\b/g,
    message: "Outdated name — write `X (Twitter)`.",
    suggestion: "X (Twitter)",
  },
  {
    regex: /\b(?:Startlight|Starligth|Starligh|StarLight)\b/g,
    message: "Typo — write `Starlight`.",
    suggestion: "Starlight",
  },
  {
    regex: /\bWebstorm\b/g,
    message: "Wrong capitalisation — write `WebStorm`.",
    suggestion: "WebStorm",
  },
  {
    regex: /\bpromt\b/g,
    message: "Typo — write `prompt`.",
    suggestion: "prompt",
  },
];
