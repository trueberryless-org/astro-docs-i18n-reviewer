import type { LanguageRule } from "../types.js";

export const jaRules: LanguageRule = {
  locale: "ja",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/%E6%97%A5%E6%9C%AC%E8%AA%9E.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/ja/`.",
    },
    {
      regex: /:::(?:ノート|ヒント|注意|警告|危険)\b/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Terms that must NOT be over-translated ───────────────────────────────
    {
      regex: /マークダウン/g,
      message:
        "`マークダウン` should not be used — keep `Markdown` in English per the guide.",
      suggestion: "Markdown",
    },
    {
      regex: /イシュー/g,
      message:
        "`イシュー` should not be used — keep GitHub `Issue` in English per the guide.",
      suggestion: "Issue",
    },

    // ── Glossary terms that MUST be translated ───────────────────────────────
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `ルーティング` (also used for `route` — to distinguish from `root`).",
      suggestion: "ルーティング",
    },
    {
      regex: /\bpartial hydration\b/gi,
      message:
        "`partial hydration` should be translated to `パーシャルハイドレーション`.",
      suggestion: "パーシャルハイドレーション",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Astroアイランド`.",
      suggestion: "Astroアイランド",
    },
    {
      regex: /\bisland architecture\b/gi,
      message:
        "`island architecture` should be translated to `アイランドアーキテクチャ`.",
      suggestion: "アイランドアーキテクチャ",
    },
    {
      regex: /\bdependency\b/gi,
      message:
        "`dependency` should be translated to `依存関係`.",
      suggestion: "依存関係",
    },
    {
      regex: /\bcontributor\b/gi,
      message:
        "`contributor` should be translated to `コントリビューター` (but `contribute` as a verb → `貢献する`).",
      suggestion: "コントリビューター",
    },
    {
      regex: /\badapter\b/gi,
      message:
        "`adapter` should be translated to `アダプター`.",
      suggestion: "アダプター",
    },
    {
      regex: /\bcontent collections?\b/gi,
      message:
        "`content collections` should be translated to `コンテンツコレクション`.",
      suggestion: "コンテンツコレクション",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `インテグレーション` when referring to Astro integrations.",
      suggestion: "インテグレーション",
    },
    {
      regex: /\bfrontmatter\b/gi,
      message:
        "`frontmatter` as a concept should be translated to `フロントマター`. When used as a property reference (e.g. `frontmatter.title`), leave it untranslated.",
      suggestion: "フロントマター",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `ビュートランジション`.",
      suggestion: "ビュートランジション",
    },
    {
      regex: /\bdeployment\b/gi,
      message:
        "`deployment` should be translated to `デプロイ`.",
      suggestion: "デプロイ",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `アクセシビリティ`.",
      suggestion: "アクセシビリティ",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoint` should be translated to `エンドポイント`.",
      suggestion: "エンドポイント",
    },
    {
      regex: /\bmiddleware\b/gi,
      message:
        "`middleware` should be translated to `ミドルウェア`.",
      suggestion: "ミドルウェア",
    },

    // ── Katakana long vowel (guide: architecture → アーキテクチャ, not アーキテクチャー) ─
    {
      regex: /アーキテクチャー/g,
      message:
        "Per the guide, `architecture` in katakana does not use a trailing long vowel — write `アーキテクチャ` (not `アーキテクチャー`).",
      suggestion: "アーキテクチャ",
    },
  ],
};
