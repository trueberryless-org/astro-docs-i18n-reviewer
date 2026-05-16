# Astro Docs i18n Reviewer

> Automated translation review tool for [Astro Docs](https://github.com/withastro/docs) pull requests.

[![CI](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/actions/workflows/ci.yaml/badge.svg)](https://github.com/trueberryless-org/astro-docs-i18n-reviewer/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## What it does

Paste a GitHub PR URL (or number) from the [withastro/docs](https://github.com/withastro/docs) repository, provide a fine-grained GitHub token with **Pull requests (write)** permission, and get:

- **Structured review summary** — per-file breakdown of every suggestion, sorted by line number
- **One-click GitHub suggestion threads** — inline diff comments with `suggestion` blocks translators can accept in a single click
- **Heading structure comparison** — detects missing or extra headings by comparing the translated file against the original English, pointing you to the exact section
- **Untranslated content detection** — flags prose paragraphs and code comments that are identical to the original English
- **Language-specific terminology rules** — 10 supported locales, each with a curated ruleset drawn from the official i18n guides and merged PR reviews
- **Common rules for all languages** — brand-name capitalisation (GitHub, JavaScript, TypeScript, npm, …) applied universally
- **Outside-diff suggestions** — issues that exist outside the changed lines are collected in the overview comment instead of failing the GitHub API call

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

Visit **[astro-docs-i18n-reviewer.trueberryless.org](https://astro-docs-i18n-reviewer.trueberryless.org)** — no installation required.

You'll need a [fine-grained GitHub token](https://github.com/settings/tokens/new?description=Astro+i18n+Reviewer&type=fine_grained) with:
- **Repository access**: Public repositories (read-only for content, write for pull requests)
- **Permissions**: Pull requests → Read and Write

### Run locally

```bash
# Clone the repository
git clone https://github.com/trueberryless-org/astro-docs-i18n-reviewer.git
cd astro-docs-i18n-reviewer

# Install dependencies
pnpm install

# Build the core package
pnpm --filter @astro-docs-i18n-reviewer/core build

# Start the web app
pnpm --filter @astro-docs-i18n-reviewer/web dev
```

## Project structure

```
astro-docs-i18n-reviewer/
├── packages/
│   └── core/          # Analysis engine — language rules, GitHub API, review logic
└── apps/
    └── web/           # Astro web frontend
```

## Adding or improving language rules

Each supported locale lives in `packages/core/src/rules/<locale>.ts`. Rules that apply to every language (brand names, etc.) are in `packages/core/src/rules/common.ts`.

A rule looks like:

```ts
{
  regex: /\bdeployen\b/gi,
  message: "`deployen` is an anglicism — use `veröffentlichen` instead.",
  suggestion: "veröffentlichen", // optional: generates a one-click GitHub suggestion
}
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## License

[MIT](./LICENSE) © [trueberryless-org](https://github.com/trueberryless-org)
