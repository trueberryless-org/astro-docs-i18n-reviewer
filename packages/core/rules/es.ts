import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

const SENTENCE_START = String.raw`(?<=^[ \t]*(?:(?:[-*+]|\d+\.)[ \t]+)?|[.!?:][ \t]+)`;

export const esRules: LanguageRule = {
  locale: "es",
  mdnLocale: "es",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Tone: the Spanish docs address the reader with `tú` ─────────────────
    {
      regex: matchWord("usted(?:es)?|vosotros|vosotras|vuestr[oa]s?"),
      message:
        "The Spanish docs address the reader informally with `tú` — avoid `usted`/`vosotros`.",
    },
    ...(
      [
        ["Asegúrese", "Asegúrate"],
        ["Consulte", "Consulta"],
        ["Tenga en cuenta", "Ten en cuenta"],
        ["Ejecute", "Ejecuta"],
        ["Instale", "Instala"],
        ["Aprenda", "Aprende"],
        ["Agregue", "Agrega"],
        ["Añada", "Añade"],
        ["Utilice", "Utiliza"],
        ["Abra", "Abre"],
        ["Visite", "Visita"],
        ["Cree", "Crea"],
        ["Haga", "Haz"],
        ["Vea", "Consulta"],
      ] satisfies [string, string][]
    ).map(([usted, tu]) => ({
      regex: new RegExp(`${SENTENCE_START}${usted}(?![\\p{L}\\p{M}])`, "gmu"),
      message: `Use the informal imperative \`${tu}\` instead of \`${usted}\` — the Spanish docs address the reader with \`tú\`.`,
      suggestion: tu,
    })),

    // ── Typography ───────────────────────────────────────────────────────────
    {
      regex: /^[^¿\n]*\p{L}\?/gmu,
      message:
        "Questions in Spanish need an opening question mark — add `¿` at the start of the question.",
    },

    // ── Grammatical gender used by the Spanish docs ─────────────────────────
    {
      regex: matchWord("el API"),
      message: "`API` is feminine in the Spanish docs — write `la API`.",
      suggestion: "la API",
    },
    {
      regex: matchWord("el CLI"),
      message: "`CLI` is feminine in the Spanish docs — write `la CLI`.",
      suggestion: "la CLI",
    },
    {
      regex: matchWord("la frontmatter"),
      message:
        "`frontmatter` is masculine in the Spanish docs — write `el frontmatter`.",
      suggestion: "el frontmatter",
    },
    {
      regex: matchWord("la middleware"),
      message:
        "`middleware` is masculine in the Spanish docs — write `el middleware`.",
      suggestion: "el middleware",
    },
    {
      regex: matchWord("la endpoint"),
      message:
        "`endpoint` is masculine in the Spanish docs — write `el endpoint`.",
      suggestion: "el endpoint",
    },

    // ── False friends and anglicisms ─────────────────────────────────────────
    {
      regex: matchWord("librer[ií]as?"),
      message:
        "`librería` is a bookshop — a software library is a `biblioteca`.",
    },
    {
      regex: matchWord("legad[oa]s?"),
      message:
        "`legacy` is translated as `heredado` in the Spanish docs, not `legado`.",
    },
    {
      regex: matchWord("ranuras?"),
      message:
        "The Spanish docs keep `slot` untranslated (e.g. `un slot`, `los slots`) — avoid `ranura`.",
    },
    {
      regex: matchWord("customiz\\p{L}*"),
      message:
        "`customizar` is an anglicism — use `personalizar` (and `personalizado`, `personalización`).",
    },
    {
      regex: matchWord("sete(?:ar|ad[oa]s?|a|an|o)"),
      message:
        "`setear` is an anglicism — use `establecer`, `definir` or `configurar`.",
    },
    {
      regex: matchWord("debugg?e\\p{L}*"),
      message: "`debuggear` is an anglicism — use `depurar` (`depuración`).",
    },
    {
      regex: matchWord("cheque(?:ar|a|an|ad[oa]s?)"),
      message: "`chequear` is an anglicism — use `comprobar` or `verificar`.",
    },
    {
      regex: matchWord("parse(?:ar|a|an|ad[oa]s?|o)"),
      message: "`parsear` is an anglicism — use `analizar`.",
    },
    {
      regex: matchWord("deploy(?:ar|ad[oa]s?|s)?|hacer deploy", "gu"),
      message:
        "`deploy` should be translated — use `desplegar` / `despliegue`.",
    },
    {
      regex: /(?<![\p{L}\p{M}])actions?(?![\p{L}\p{M}])/gu,
      message:
        "Astro Actions are called `acciones` in the Spanish docs — translate `action(s)` to `acción`/`acciones`.",
    },
    {
      regex: matchWord("carácteristicas?"),
      message: "Typo — write `característica` (no accent on the first `a`).",
    },
  ],
};
