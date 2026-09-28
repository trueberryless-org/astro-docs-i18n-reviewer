# Astro Docs i18n Reviewer

> Automated translation review tool for [Astro Docs](https://github.com/withastro/docs) pull requests.

[![CI](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/actions/workflows/ci.yaml/badge.svg)](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/blob/main/LICENSE)

## What it does

Paste a GitHub PR URL (or number) from the [withastro/docs](https://github.com/withastro/docs) or [withastro/starlight](https://github.com/withastro/starlight) repository, provide a GitHub token, and get a review report you can copy into a PR comment:

- **Structured review summary** — per-file breakdown of every suggestion, sorted by line number
- **Suggested replacements** — rules with a canonical replacement include a `suggestion` block showing the corrected line
- **Heading structure comparison** — detects missing or extra headings by comparing the translated file against the original English, pointing you to the exact section
- **Untranslated content detection** — flags prose paragraphs and code comments that are identical to the original English
- **Links to English pages** — flags internal links that still point to `/en/` instead of the translated locale
- **Language-specific terminology rules** — 10 supported locales, each with a curated ruleset drawn from the official i18n guides and merged PR reviews
- **Common rules for all languages** — brand-name capitalisation (GitHub, JavaScript, TypeScript, npm, …) applied universally

Only lines changed in the PR are checked for rule and untranslated-content matches, so pre-existing issues elsewhere in a file don't clutter the report.

## Supported languages

| Code | Language |
|------|----------|
| `ar` | Arabic |
| `de` | German |
| `fr` | French |
| `it` | Italian |
| `ja` | Japanese |
| `ko` | Korean |
| `pt-br` | Portuguese (Brazil) |
| `ru` | Russian |
| `zh-cn` | Simplified Chinese |
| `zh-tw` | Traditional Chinese |

## Getting started

### Use the hosted app

Visit **[astro-docs-i18n-reviewer.netlify.app](https://astro-docs-i18n-reviewer.netlify.app)** — no installation required.

You'll need a [classic GitHub token](https://github.com/settings/tokens/new?description=Astro+i18n+Reviewer) without any scopes. The reviewer only reads public repositories, and the token is sent directly from your browser to the GitHub API.

### Run locally

```bash
# Clone the repository
git clone https://github.com/trueberryless-org/astro-docs-i18n-reviewer.git
cd astro-docs-i18n-reviewer

# Install dependencies
pnpm install

# Start the web app
pnpm dev
```

## Project structure

```
astro-docs-i18n-reviewer/
├── packages/
│   └── core/          # Analysis engine — language rules, GitHub API, review logic, unit tests
└── apps/
    └── web/           # Astro web frontend
```

## Adding or improving language rules

Each supported locale lives in [`packages/core/rules/<locale>.ts`](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/tree/main/packages/core/rules). Rules that apply to every language (brand names, etc.) are in [`packages/core/rules/common.ts`](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/blob/main/packages/core/rules/common.ts).

A rule looks like:

```ts
{
  regex: /\bdeployen\b/gi,
  message: "`deployen` is an anglicism — use `veröffentlichen` instead.",
  suggestion: "veröffentlichen", // optional: shows the corrected line in the report
}
```

See [CONTRIBUTING.md](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/blob/main/CONTRIBUTING.md) for the full guide.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/blob/main/CONTRIBUTING.md) first.

## License

Licensed under the MIT License, Copyright © trueberryless.

See [LICENSE](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/blob/main/LICENSE) for more information.
