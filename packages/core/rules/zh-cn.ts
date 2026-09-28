import type { LanguageRule } from "../types.js";

export const zhCnRules: LanguageRule = {
  locale: "zh-cn",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/zh-cn/`.",
    },
    {
      regex: /:::(?:注|提示|注意|警告|危险)\b/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Glossary terms ────────────────────────────────────────────────────────
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `适配器`.",
      suggestion: "适配器",
    },
    {
      regex: /\bhydration\b/gi,
      message:
        "`hydration` should be translated to `激活`.",
      suggestion: "激活",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoint` should be translated to `端点`.",
      suggestion: "端点",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `组件`.",
      suggestion: "组件",
    },
    {
      regex: /\bframework\b/gi,
      message:
        "`framework` should be translated to `框架`.",
      suggestion: "框架",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `集成`.",
      suggestion: "集成",
    },
    {
      regex: /\bmodule\b/gi,
      message:
        "`module` should be translated to `模块`.",
      suggestion: "模块",
    },
    {
      regex: /\bmigration\b/gi,
      message:
        "`migration` should be translated to `迁移`.",
      suggestion: "迁移",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `无障碍`.",
      suggestion: "无障碍",
    },
    {
      regex: /\barchitecture\b/gi,
      message:
        "`architecture` should be translated to `架构`.",
      suggestion: "架构",
    },
    {
      regex: /\bserver-side rendering\b/gi,
      message:
        "`server-side rendering` should be translated to `服务端渲染`.",
      suggestion: "服务端渲染",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Astro 群岛`.",
      suggestion: "Astro 群岛",
    },
    {
      regex: /\blibrar(?:y|ies)\b/gi,
      message:
        "`library` should be translated to `库`.",
      suggestion: "库",
    },
    {
      regex: /\bpackages?\b/gi,
      message:
        "`package` should be translated to `包`.",
      suggestion: "包",
    },
    {
      regex: /\bprops?\b/gi,
      message:
        "`props` should be translated to `参数` (unless referencing the `props` variable directly).",
      suggestion: "参数",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `路由`.",
      suggestion: "路由",
    },
    {
      regex: /\bdeployment\b/gi,
      message:
        "`deployment` should be translated to `部署`.",
      suggestion: "部署",
    },

    // ── Common pitfalls ──────────────────────────────────────────────────────
    {
      regex: /您/g,
      message:
        "Use `你` instead of `您` — Astro docs prefer a casual, friendly tone.",
      suggestion: "你",
    },
    {
      regex: /其它/g,
      message:
        "Use `其他` instead of `其它` — `其他` is the standard simplified Chinese form.",
      suggestion: "其他",
    },
    {
      regex: /\bfrontmatter\b/gi,
      message:
        "`frontmatter` as a term stays untranslated (写作 `frontmatter`).",
    },
    {
      regex: /\bslug\b/gi,
      message:
        "`slug` stays untranslated.",
    },
  ],
};
