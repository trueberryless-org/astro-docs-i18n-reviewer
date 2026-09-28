import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const ukRules: LanguageRule = {
  locale: "uk",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Alphabet ─────────────────────────────────────────────────────────────
    {
      regex: /[ыЫэЭъЪёЁ]/gu,
      message:
        "The letters `ы`, `э`, `ъ` and `ё` don't exist in Ukrainian — check for Russian spelling (e.g. `и`, `е`, `'`, `йо`).",
    },

    // ── Russianisms ──────────────────────────────────────────────────────────
    {
      regex: matchWord("явля(?:ється|ються|вся|лася|лося|лися)"),
      message: "`являється` is a Russianism — use `є`.",
    },
    {
      regex: matchWord("слідуюч\\p{L}*"),
      message: "`слідуючий` is a Russianism — use `наступний`.",
    },
    {
      regex: matchWord("на протязі"),
      message: "`на протязі` is a Russianism — use `протягом`.",
      suggestion: "протягом",
    },
    {
      regex: matchWord("прийма\\p{L}* участь"),
      message: "`приймати участь` is a Russianism — use `брати участь`.",
    },
    {
      regex: matchWord("співпада\\p{L}*"),
      message: "`співпадати` is a Russianism — use `збігатися`.",
    },
    {
      regex: matchWord("в залежності від"),
      message: "`в залежності від` is a Russianism — use `залежно від`.",
      suggestion: "залежно від",
    },
    {
      regex: matchWord("получ(?:ити|ати|ає|аєте|аємо|ений|ена|ено|ені)"),
      message: "`получити` is a Russianism — use `отримати` / `отримувати`.",
    },
  ],
};
