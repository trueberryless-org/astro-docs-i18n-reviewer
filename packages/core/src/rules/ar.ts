import type { LanguageRule } from "../types.js";

export const arRules: LanguageRule = {
  locale: "ar",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/ar/`.",
    },
    {
      regex: /:::[\u0600-\u06FF]/g,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Terms that MUST be translated ────────────────────────────────────────
    {
      regex: /\bframework\b/gi,
      message:
        "`framework` should be translated to `إطار عمل`.",
      suggestion: "إطار عمل",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `مكوّن`.",
      suggestion: "مكوّن",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `جزر أسترو`.",
      suggestion: "جزر أسترو",
    },
    {
      regex: /\blayout\b/gi,
      message:
        "`layout` should be translated to `نسق`.",
      suggestion: "نسق",
    },
    {
      regex: /\btemplate\b/gi,
      message:
        "`template` should be translated to `قالب`.",
      suggestion: "قالب",
    },
    {
      regex: /\bversion\b/gi,
      message:
        "`version` should be translated to `إصدار`.",
      suggestion: "إصدار",
    },
    {
      regex: /\bfrontend\b/gi,
      message:
        "`frontend` should be translated to `واجهة أمامية`.",
      suggestion: "واجهة أمامية",
    },
    {
      regex: /\bbackend\b/gi,
      message:
        "`backend` should be translated to `واجهة خلفية`.",
      suggestion: "واجهة خلفية",
    },
    {
      regex: /\beditor\b/gi,
      message:
        "`editor` should be translated to `محرر`.",
      suggestion: "محرر",
    },
    {
      regex: /\bupgrade\b/gi,
      message:
        "`upgrade` should be translated to `ترقية`.",
      suggestion: "ترقية",
    },
    {
      regex: /\bmigrate?\b/gi,
      message:
        "`migrate` should be translated to `تحويل`.",
      suggestion: "تحويل",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `تكامل`.",
      suggestion: "تكامل",
    },
    {
      regex: /\bdeploy(ment)?\b/gi,
      message:
        "`deploy` / `deployment` should be translated to `نشر`.",
      suggestion: "نشر",
    },
    {
      regex: /\bstatic\b/gi,
      message:
        "`static` should be translated to `ثابت`.",
      suggestion: "ثابت",
    },
    {
      regex: /\bdynamic\b/gi,
      message:
        "`dynamic` should be translated to `ديناميكي`.",
      suggestion: "ديناميكي",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `توجيه`.",
      suggestion: "توجيه",
    },
    {
      regex: /\brendering\b/gi,
      message:
        "`rendering` should be translated to `تصيير`.",
      suggestion: "تصيير",
    },
    {
      regex: /\bscript\b/gi,
      message:
        "`script` should be translated to `نص برمجي`.",
      suggestion: "نص برمجي",
    },
    {
      regex: /\bimport\b/gi,
      message:
        "`import` should be translated to `إضافة` or `استيراد`.",
      suggestion: "استيراد",
    },
    {
      regex: /\bexport\b/gi,
      message:
        "`export` should be translated to `تصدير`.",
      suggestion: "تصدير",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoints` should be translated to `نقاط طرفية`.",
      suggestion: "نقاط طرفية",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `انتقال المشهد`.",
      suggestion: "انتقال المشهد",
    },
    {
      regex: /\brepository\b/gi,
      message:
        "`repository` should be translated to `مستودع`.",
      suggestion: "مستودع",
    },
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `موائمة`.",
      suggestion: "موائمة",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `موَجِّه`.",
      suggestion: "موَجِّه",
    },
    {
      regex: /\bbundles?\b/gi,
      message:
        "`bundle` should be translated to `رزمة`.",
      suggestion: "رزمة",
    },
    {
      regex: /\bpackages?\b/gi,
      message:
        "`package` should be translated to `حزمة`.",
      suggestion: "حزمة",
    },
    {
      regex: /\bconfiguration\b/gi,
      message:
        "`configuration` should be translated to `إعدادات`.",
      suggestion: "إعدادات",
    },
    {
      regex: /\brecipes?\b/gi,
      message:
        "`recipe` should be translated to `مثال` (practical example — not a literal cooking recipe).",
      suggestion: "مثال",
    },

    // ── Terms that must NOT be translated (guide: "كلمات لا تحتاج إلى ترجمة") ─
    {
      regex: /\bواجهة برمجة التطبيقات\b/g,
      message:
        "`API` should stay as `API` (add `(API)` if clarification is needed).",
      suggestion: "API",
    },
  ],
};
