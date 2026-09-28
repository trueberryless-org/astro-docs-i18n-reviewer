# Contributing to Astro Docs i18n Reviewer

Thank you for helping improve translation quality for the Astro community! 🎉

## Table of contents

- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Adding or improving language rules](#adding-or-improving-language-rules)
- [Running CI checks locally](#running-ci-checks-locally)
- [Submitting a pull request](#submitting-a-pull-request)
- [Reporting bugs](#reporting-bugs)

---

## Development setup

**Prerequisites**: [Node.js ≥ 22.12](https://nodejs.org/) and [pnpm ≥ 11](https://pnpm.io/).

```bash
git clone https://github.com/trueberryless-org/astro-docs-i18n-reviewer.git
cd astro-docs-i18n-reviewer

pnpm install

# Start the dev server
pnpm dev
```

Open <http://localhost:4321> in your browser.

---

## Project structure

```
astro-docs-i18n-reviewer/
├── packages/
│   └── core/
│       ├── index.ts              # Public entry point
│       ├── libs/                 # Review logic (GitHub API, Markdown parsing, checks)
│       ├── rules/
│       │   ├── common.ts         # Rules applied to every language
│       │   ├── index.ts          # Rule registry
│       │   ├── de.ts
│       │   ├── fr.ts
│       │   └── ...               # One file per supported locale
│       └── tests/unit/           # Vitest unit tests
└── apps/
    └── web/
        └── src/
            ├── components/       # UI components
            ├── libs/report.ts    # Report rendering helpers
            └── pages/
                └── index.astro   # Main UI page
```

---

## Adding or improving language rules

Each locale lives in `packages/core/rules/<locale>.ts` and exports a `LanguageRule`:

```ts
import type { LanguageRule } from "../libs/types";

export const deRules: LanguageRule = {
  locale: "de",
  guideUrl: "https://github.com/withastro/docs/blob/main/i18n-guides/deutsch.md",
  patterns: [
    {
      regex: /\bdeployen\b/gi,
      message: "`deployen` is an anglicism — use `veröffentlichen` instead.",
      suggestion: "veröffentlichen",
    },
  ],
};
```

### Rule fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `regex` | `RegExp` | ✅ | Pattern to match in the translated file |
| `message` | `string` | ✅ | Human-readable explanation shown in the review comment |
| `suggestion` | `string` | — | Replacement text used to show the corrected line in the report |

### Universal rules

Rules that apply to every language (brand-name capitalisation, translated aside types, etc.) go in `packages/core/rules/common.ts`. **Do not duplicate** these in individual locale files. Link, frontmatter, component, slot and heading checks run for every locale automatically.

### Matching words in any script

JavaScript's `\b` only understands ASCII letters, so it doesn't work next to letters like `ż`, `é`, Cyrillic, Devanagari or Arabic. Use the `matchWord()` helper instead, which matches whole words in any script:

```ts
import { matchWord } from "../libs/rules";

{
  regex: matchWord("komend(?:a|y|ę)"),
  message: "Use `polecenie` instead of `komenda` for CLI commands.",
}
```

### Validating a rule

Before adding a rule, check that it doesn't fire on the existing, already reviewed translations of the language: a rule that matches many merged pages usually contradicts what the language's translators agreed on.

### Tips for good rules

- Read through merged translation PRs at <https://github.com/withastro/docs/pulls?q=label%3Ai18n+is%3Aclosed+is%3Amerged> for inspiration — these are real mistakes that happened.
- Prefer specific regexes over broad ones to avoid false positives.
- Include a `suggestion` whenever there is a single canonical replacement.
- Rules never see code blocks, inline code, HTML/JSX tags, link URLs or MDX imports — run the dev server and test against a real PR to double-check.

### Registering a new locale

1. Create `packages/core/rules/<locale>.ts`.
2. Add it to `packages/core/rules/index.ts` (import + entry in the `LANGUAGES` map).
3. Add the language to the lists in `apps/web/src/components/PRForm.astro`, `README.md` and `.github/ISSUE_TEMPLATE/bug_report.yaml`.
4. If [MDN](https://developer.mozilla.org/) is available in the language, set `mdnLocale` so links to English MDN pages are reported.

---

## Running CI checks locally

```bash
# Type-check the whole repository
pnpm check

# Run the unit tests
pnpm test

# Build the web app
pnpm build
```

---

## Submitting a pull request

1. Fork the repository and create a branch: `git checkout -b feat/my-improvement`.
2. Make your changes and run the CI checks above.
3. Open a pull request against `main`. Fill out the PR template.
4. A maintainer will review it — usually within a few days.

Please keep PRs focused on a single concern. Large PRs are harder to review and slower to merge.

---

## Reporting bugs

Use the **[Bug report](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/issues/new?template=bug_report.yaml)** issue template. Include:

- The PR URL you were reviewing
- The locale selected
- The unexpected behaviour vs. the expected behaviour
- Any browser console errors
