import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const plRules: LanguageRule = {
  locale: "pl",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Tone: the Polish docs address the reader informally and capitalise it
    {
      regex: matchWord("Państw(?:o|a|u|em)|możecie|macie"),
      message:
        "The Polish docs address the reader informally in the singular (`ty`, `możesz`) — avoid `Państwo` and plural forms.",
    },
    {
      regex:
        /(?<=[\p{Ll},] )tw(?:ój|oja|oje|ojego|ojej|oją|oim|oimi|oich|ojemu)(?![\p{L}\p{M}])/gu,
      message:
        "The Polish docs capitalise pronouns addressing the reader — write `Twój`, `Twoje`, `Twojego`, etc.",
    },

    // ── Terminology ──────────────────────────────────────────────────────────
    {
      regex: matchWord("komend(?:a|y|ę|zie|ą|om|ami|ach)?"),
      message:
        "Use `polecenie` (`polecenia`, `poleceń`) instead of `komenda` for CLI commands.",
    },
    {
      regex: matchWord("manualn\\p{L}*"),
      message: "`manualny` is a calque — use `ręczny` / `ręcznie`.",
    },
    {
      regex: matchWord("reuży\\p{L}*"),
      message: "`reużywać` is a calque — use `ponownie używać`.",
    },
    {
      regex: matchWord("wystartow\\p{L}*"),
      message: "Use `uruchomić` or `rozpocząć` instead of `wystartować`.",
    },
    {
      regex: matchWord("deploy\\p{L}*"),
      message: "Translate `deploy` — use `wdrożenie` / `wdrożyć`.",
    },

    // ── Spelling: `nie` is written together with adjectives and participles
    {
      regex: matchWord(
        "nie (?:potrzebn|możliw|poprawn|wymagan|obsługiwan|zależn)\\p{L}*"
      ),
      message:
        "`nie` is written together with adjectives and adjectival participles — e.g. `niepotrzebny`, `niemożliwy`, `niepoprawny`.",
    },
  ],
};
