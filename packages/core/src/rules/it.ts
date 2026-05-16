import type { LanguageRule } from "../types.js";

export const itRules: LanguageRule = {
  locale: "it",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/italiano.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/it/`.",
    },
    {
      regex: /:::(nota|suggerimento|attenzione|avvertimento|avvertenza|pericolo|consiglio)\b/gi,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Terms that MUST be translated ────────────────────────────────────────
    {
      regex: /\bclient-side\b/gi,
      message:
        "`client-side` should be translated to `lato client` or `lato browser`.",
      suggestion: "lato client",
    },
    {
      regex: /\bserver-side rendering\b/gi,
      message:
        "`server-side rendering` should be translated to `rendering lato server` (or abbreviated as `SSR`).",
      suggestion: "rendering lato server",
    },
    {
      regex: /\bserver-side\b/gi,
      message:
        "`server-side` should be translated to `lato server`.",
      suggestion: "lato server",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Isole Astro`.",
      suggestion: "Isole Astro",
    },
    {
      regex: /\bisland architecture\b/gi,
      message:
        "`island architecture` should be translated to `architettura a isole`.",
      suggestion: "architettura a isole",
    },
    {
      regex: /\bpartial hydration\b/gi,
      message:
        "`partial hydration` should be translated to `idratazione parziale`.",
      suggestion: "idratazione parziale",
    },
    {
      regex: /\bfrontmatter\b/gi,
      message:
        "`frontmatter` should be translated to `avantesto` in Italian (or explained as \"blocco iniziale delimitato da `---`\").",
      suggestion: "avantesto",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `componente`.",
      suggestion: "componente",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `integrazione`.",
      suggestion: "integrazione",
    },
    {
      regex: /\bdeployment\b/gi,
      message:
        "`deployment` should be translated to `distribuzione` or `pubblicazione`.",
      suggestion: "distribuzione",
    },
    {
      regex: /\bdeploy\b/gi,
      message:
        "`deploy` should be translated to `distribuire` (verb) or `distribuzione` (noun).",
      suggestion: "distribuire",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoint` can stay as `endpoint` or be translated to `punto d'accesso` — be consistent.",
    },
    {
      regex: /\bbundles?\b/gi,
      message:
        "`bundle` should be translated to `pacchetto` in Italian.",
      suggestion: "pacchetto",
    },
    {
      regex: /\bpackages?\b/gi,
      message:
        "`package` should be translated to `pacchetto`.",
      suggestion: "pacchetto",
    },
    {
      regex: /\broutes?\b/gi,
      message:
        "`route` can stay as `route` or be translated to `rotta` — be consistent.",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `accessibilità`.",
      suggestion: "accessibilità",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `direttiva`.",
      suggestion: "direttiva",
    },
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `adattatore`.",
      suggestion: "adattatore",
    },
    {
      regex: /\bdeprecated?\b/gi,
      message:
        "`deprecated` should be translated to `deprecato`.",
      suggestion: "deprecato",
    },

    // ── Terms that must NOT be translated (guide: "Vocaboli senza traduzione") ─
    {
      regex: /\bquadro di lavoro\b/gi,
      message:
        "`quadro di lavoro` is a mistranslation — `Framework` should stay in English per the guide.",
    },
    {
      regex: /\bcorpo principale\b/gi,
      message:
        "Brand/tech names like `Frontend`/`Backend` should stay in English, not be translated.",
    },
  ],
};
