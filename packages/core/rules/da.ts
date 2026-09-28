import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const daRules: LanguageRule = {
  locale: "da",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    {
      regex: /(?<=[\p{Ll},] )(?:De|Dem|Deres)(?![\p{L}\p{M}])/gu,
      message:
        "The Danish docs address the reader informally — use `du`, `dig` and `din`/`dit`/`dine` instead of the formal `De`/`Dem`/`Deres`.",
    },
    {
      regex: matchWord(
        "(?:Astro|Starlight|Markdown|MDX|GitHub|npm) (?:projekt|komponent|side|integration|konfiguration|fil|plugin|tema)\\p{L}*"
      ),
      message:
        "Compound nouns are written together in Danish — join a name and a noun with a hyphen, e.g. `Astro-projekt`, `Starlight-siden`.",
    },
    {
      regex: matchWord("eksekver\\p{L}*"),
      message: "Use `køre` (e.g. `kør kommandoen`) instead of `eksekvere`.",
    },
  ],
};
