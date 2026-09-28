import type { LanguageRule } from "../libs/types";

export const faRules: LanguageRule = {
  locale: "fa",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Persian characters instead of their Arabic look-alikes ───────────────
    {
      regex: /ي/gu,
      message:
        "Use the Persian letter `ی` (U+06CC) instead of the Arabic `ي` (U+064A).",
      suggestion: "ی",
    },
    {
      regex: /ك/gu,
      message:
        "Use the Persian letter `ک` (U+06A9) instead of the Arabic `ك` (U+0643).",
      suggestion: "ک",
    },
    {
      regex: /[٠-٩]/gu,
      message:
        "Use Persian digits (`۰`–`۹`) instead of Arabic-Indic digits (`٠`–`٩`).",
    },

    // ── Zero-width non-joiner (نیم‌فاصله) ────────────────────────────────────
    {
      regex: /(?<![\p{L}\p{M}])(ن?می) (?=\p{Script=Arabic})/gu,
      message:
        "Join the verb prefix `می` to the verb with a zero-width non-joiner (نیم‌فاصله, U+200C) instead of a space — e.g. `می‌شود`.",
    },
    {
      regex: /(?<=\p{Script=Arabic}) (ها|های|هایی)(?![\p{L}\p{M}])/gu,
      message:
        "Join the plural suffix `ها` to the word with a zero-width non-joiner (نیم‌فاصله, U+200C) instead of a space — e.g. `فایل‌ها`.",
    },
  ],
};
