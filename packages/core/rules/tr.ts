import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const trRules: LanguageRule = {
  locale: "tr",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Apostrophe before suffixes on proper nouns ───────────────────────────
    {
      regex:
        /(?<![\p{L}\p{M}])(?:Astro|Starlight|GitHub|Markdown|MDX|JavaScript|TypeScript|Vite|Netlify|Vercel)(?=[a-zçğıöşü]{1,6}(?![\p{L}\p{M}]))/gu,
      message:
        "Separate suffixes from proper nouns with an apostrophe — e.g. `Astro'nun`, `Starlight'ı`.",
    },

    // ── Spelling ─────────────────────────────────────────────────────────────
    {
      regex: matchWord("herhangibir"),
      message: "Write `herhangi bir` as two words.",
      suggestion: "herhangi bir",
    },
    {
      regex: matchWord("hiçbirşey"),
      message: "Write `hiçbir şey` as two words.",
      suggestion: "hiçbir şey",
    },
    {
      regex: matchWord("birşey\\p{L}*"),
      message: "Write `bir şey` as two words.",
    },
    {
      regex: matchWord("yada"),
      message: "Write `ya da` as two words.",
      suggestion: "ya da",
    },
    {
      regex: matchWord("bir çok|bir kaç"),
      message: "Write `birçok` / `birkaç` as one word.",
    },
  ],
};
