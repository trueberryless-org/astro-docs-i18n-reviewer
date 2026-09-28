import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const hiRules: LanguageRule = {
  locale: "hi",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Brand names stay in Latin script ─────────────────────────────────────
    ...(
      [
        ["एस्ट्रो", "Astro"],
        ["स्टारलाइट", "Starlight"],
        ["टाइपस्क्रिप्ट", "TypeScript"],
        ["जावास्क्रिप्ट", "JavaScript"],
        ["गिटहब", "GitHub"],
      ] satisfies [string, string][]
    ).map(([transliteration, name]) => ({
      regex: matchWord(transliteration),
      message: `Keep the name \`${name}\` in Latin script instead of transliterating it (\`${transliteration}\`).`,
      suggestion: name,
    })),

    // ── Tone and typography ──────────────────────────────────────────────────
    {
      regex: matchWord("तुम(?:्हें|्हारा|्हारी|्हारे)?|तू|तेरा|तेरी|तेरे"),
      message:
        "The Hindi docs address the reader formally with `आप` — avoid `तुम`/`तू`.",
    },
    {
      regex: /(?<=\p{Script=Devanagari})\.(?=\s|$)/gmu,
      message:
        "End Hindi sentences with a purna viram `।` instead of a full stop.",
      suggestion: "।",
    },

    // ── Spelling and terminology used by the Hindi docs ──────────────────────
    {
      regex: matchWord("फाइल(?:ें|ों)?"),
      message: "Write `फ़ाइल` with a nukta, as in the rest of the Hindi docs.",
    },
    {
      regex: matchWord("फोल्डर(?:ों)?"),
      message:
        "Write `फ़ोल्डर` with a nukta, as in the rest of the Hindi docs.",
    },
    {
      regex: matchWord("संपादक"),
      message: "The Hindi docs use `एडिटर` for a code editor.",
      suggestion: "एडिटर",
    },
  ],
};
