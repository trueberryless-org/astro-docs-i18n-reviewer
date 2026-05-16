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

**Prerequisites**: [Node.js ≥ 24](https://nodejs.org/) and [pnpm ≥ 11](https://pnpm.io/).

```bash
git clone https://github.com/trueberryless-org/astro-docs-i18n-reviewer.git
cd astro-docs-i18n-reviewer

pnpm install

# Build the core package first (the web app depends on it)
pnpm --filter @astro-docs-i18n-reviewer/core build

# Start the dev server
pnpm --filter @astro-docs-i18n-reviewer/web dev
```

Open <http://localhost:4321> in your browser.

---

## Project structure

```
astro-docs-i18n-reviewer/
├── packages/
│   └── core/
│       ├── src/
│       │   ├── index.ts          # Main analysis engine
│       │   └── rules/
│       │       ├── common.ts     # Rules applied to every language
│       │       ├── index.ts      # Rule registry + locale helpers
│       │       ├── de.ts
│       │       ├── fr.ts
│       │       └── ...           # One file per supported locale
│       └── tsconfig.json
└── apps/
    └── web/
        └── src/
            ├── pages/
            │   └── index.astro   # Main UI page
            └── components/
                └── PRForm.astro  # PR submission form
```

---

## Adding or improving language rules

Each locale lives in `packages/core/src/rules/<locale>.ts` and exports a `LanguageRuleset`:

```ts
import type { LanguageRuleset } from "../types.js";

const ruleset: LanguageRuleset = {
  locale: "de",
  patterns: [
    {
      regex: /\bdeployen\b/gi,
      message: "`deployen` is an anglicism — use `veröffentlichen` instead.",
      suggestion: "veröffentlichen",
    },
  ],
};

export default ruleset;
```

### Rule fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `regex` | `RegExp` | ✅ | Pattern to match in the translated file |
| `message` | `string` | ✅ | Human-readable explanation shown in the review comment |
| `suggestion` | `string` | — | Replacement text for a one-click GitHub suggestion block |

### Universal rules

Rules that apply to every language (brand-name capitalisation, etc.) go in `packages/core/src/rules/common.ts`. **Do not duplicate** these in individual locale files.

### Tips for good rules

- Read through merged translation PRs at <https://github.com/withastro/docs/pulls?q=label%3Ai18n+is%3Aclosed+is%3Amerged> for inspiration — these are real mistakes that happened.
- Prefer specific regexes over broad ones to avoid false positives.
- Include a `suggestion` whenever there is a single canonical replacement.
- Check your new rule doesn't fire on the code-block or MDX-import stripping pipeline — run the dev server and test against a real PR.

### Registering a new locale

1. Create `packages/core/src/rules/<locale>.ts`.
2. Add it to `packages/core/src/rules/index.ts` (import + entry in the `LANGUAGES` map).
3. Add the locale code + display name to the sorted lists in `apps/web/src/pages/index.astro` and `apps/web/src/components/PRForm.astro`.

---

## Running CI checks locally

```bash
# Typecheck + build core
pnpm --filter @astro-docs-i18n-reviewer/core build

# Typecheck + build web
pnpm --filter @astro-docs-i18n-reviewer/web build
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

Use the **[Bug report](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/issues/new?template=bug_report.yml)** issue template. Include:

- The PR URL you were reviewing
- The locale selected
- The unexpected behaviour vs. the expected behaviour
- Any browser console errors
