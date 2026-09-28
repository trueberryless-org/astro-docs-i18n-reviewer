import type { LanguageRule } from "../types.js";

export const zhTwRules: LanguageRule = {
  locale: "zh-tw",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/%E6%AD%A3%E9%AB%94%E4%B8%AD%E6%96%87.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/zh-tw/`.",
    },
    {
      regex: /:::(?:注|提示|注意|警告|危險)\b/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Glossary terms ────────────────────────────────────────────────────────
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `配接器`.",
      suggestion: "配接器",
    },
    {
      regex: /\bbuild\b/gi,
      message:
        "`build` as a concept should be translated to `建置`.",
      suggestion: "建置",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `元件`.",
      suggestion: "元件",
    },
    {
      regex: /\bconfiguration\b/gi,
      message:
        "`configuration` should be translated to `組態`.",
      suggestion: "組態",
    },
    {
      regex: /\bdeploy(ment)?\b/gi,
      message:
        "`deploy` / `deployment` should be translated to `部署`.",
      suggestion: "部署",
    },
    {
      regex: /\bframework\b/gi,
      message:
        "`framework` should be translated to `框架`.",
      suggestion: "框架",
    },
    {
      regex: /\bhydration\b/gi,
      message:
        "`hydration` should be translated to `水合`.",
      suggestion: "水合",
    },
    {
      regex: /\bimport\b/gi,
      message:
        "`import` should be translated to `匯入`.",
      suggestion: "匯入",
    },
    {
      regex: /\bexport\b/gi,
      message:
        "`export` should be translated to `匯出`.",
      suggestion: "匯出",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `整合`.",
      suggestion: "整合",
    },
    {
      regex: /\blibrar(?:y|ies)\b/gi,
      message:
        "`library` should be translated to `函式庫`.",
      suggestion: "函式庫",
    },
    {
      regex: /\bmiddleware\b/gi,
      message:
        "`middleware` should be translated to `中介層`.",
      suggestion: "中介層",
    },
    {
      regex: /\bmigration\b/gi,
      message:
        "`migration` should be translated to `遷移`.",
      suggestion: "遷移",
    },
    {
      regex: /\bpackages?\b/gi,
      message:
        "`package` should be translated to `軟體包`.",
      suggestion: "軟體包",
    },
    {
      regex: /\bproject\b/gi,
      message:
        "`project` should be translated to `專案`.",
      suggestion: "專案",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `路由`.",
      suggestion: "路由",
    },
    {
      regex: /\bserver-side rendering\b/gi,
      message:
        "`server-side rendering` should be translated to `伺服器端算繪`.",
      suggestion: "伺服器端算繪",
    },
    {
      regex: /\brendering\b/gi,
      message:
        "`rendering` should be translated to `算繪`.",
      suggestion: "算繪",
    },
    {
      regex: /\bterminal\b/gi,
      message:
        "`terminal` should be translated to `終端機`.",
      suggestion: "終端機",
    },
    {
      regex: /\brepository\b/gi,
      message:
        "`repository` should be translated to `儲存庫`.",
      suggestion: "儲存庫",
    },
    {
      regex: /\bexperimental\b/gi,
      message:
        "`experimental` should be translated to `實驗性`.",
      suggestion: "實驗性",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `無障礙`.",
      suggestion: "無障礙",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Astro 群島`.",
      suggestion: "Astro 群島",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `指令`.",
      suggestion: "指令",
    },

    // ── Common pitfalls ──────────────────────────────────────────────────────
    {
      regex: /您/g,
      message:
        "Use `你` instead of `您` — Astro docs prefer a casual, friendly tone.",
      suggestion: "你",
    },
  ],
};
