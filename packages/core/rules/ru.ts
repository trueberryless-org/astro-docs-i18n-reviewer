import type { LanguageRule } from "../types.js";

export const ruRules: LanguageRule = {
  locale: "ru",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/russian.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/ru/`.",
    },
    {
      regex: /:::[а-яёА-ЯЁ][а-яёА-ЯЁ]+/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Glossary terms ────────────────────────────────────────────────────────
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Островки Astro`.",
      suggestion: "Островки Astro",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `маршрутизация`.",
      suggestion: "маршрутизация",
    },
    {
      regex: /\bmigration\b/gi,
      message:
        "`migration` should be translated to `переход`.",
      suggestion: "переход",
    },
    {
      regex: /\bmiddleware\b/gi,
      message:
        "`middleware` should be translated to `мидлвар`.",
      suggestion: "мидлвар",
    },
    {
      regex: /\bfrontmatter\b/gi,
      message:
        "`frontmatter` should be translated to `метаданные`.",
      suggestion: "метаданные",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoint` should be translated to `эндпойнт`.",
      suggestion: "эндпойнт",
    },
    {
      regex: /\breference\b/gi,
      message:
        "`reference` should be translated to `справочник`.",
      suggestion: "справочник",
    },
    {
      regex: /\bpartial hydration\b/gi,
      message:
        "`partial hydration` should be translated to `частичная гидратация`.",
      suggestion: "частичная гидратация",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `переходы между страницами`.",
      suggestion: "переходы между страницами",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `компонент`.",
      suggestion: "компонент",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `интеграция`.",
      suggestion: "интеграция",
    },
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `адаптер`.",
      suggestion: "адаптер",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `директива`.",
      suggestion: "директива",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `доступность`.",
      suggestion: "доступность",
    },
    {
      regex: /\bdeployment\b/gi,
      message:
        "`deployment` should be translated to `развёртывание`.",
      suggestion: "развёртывание",
    },
    {
      regex: /\bdeprecated?\b/gi,
      message:
        "`deprecated` should be translated to `устаревший`.",
      suggestion: "устаревший",
    },

    // ── Typography ────────────────────────────────────────────────────────────
    {
      regex: /"[^"\n]+"/g,
      message:
        "Use Russian typographic quotes `«…»` instead of straight double quotes `\"…\"`.",
    },
  ],
};
