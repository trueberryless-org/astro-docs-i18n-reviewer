import type { LanguageRule } from "../types.js";

export const deRules: LanguageRule = {
  locale: "de",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/deutsch.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/de/`.",
    },
    {
      regex: /:::(hinweis|tipp|warnung|achtung|gefahr)\b/gi,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Typography ───────────────────────────────────────────────────────────
    {
      regex: /"[^"\n]+"(?!\s*\()/g,
      message:
        'Use German quotation marks `„…"` instead of straight double quotes `"…"`.',
    },
    {
      regex: /\bz\. B\.\s/g,
      message:
        "`z. B.` requires a non-breaking space — write `z.\u00a0B.` (Unicode U+00A0 or `&nbsp;`).",
      suggestion: "z.\u00a0B. ",
    },
    {
      regex: /\bd\. h\.\s/g,
      message:
        "`d. h.` requires a non-breaking space — write `d.\u00a0h.` (Unicode U+00A0 or `&nbsp;`).",
      suggestion: "d.\u00a0h. ",
    },
    {
      regex: /\bu\. a\.\s/g,
      message:
        "`u. a.` requires a non-breaking space — write `u.\u00a0a.` (Unicode U+00A0 or `&nbsp;`).",
      suggestion: "u.\u00a0a. ",
    },
    {
      regex: /\b[A-Za-zÄäÖöÜüẞß]{20,}\b/g,
      message:
        "This compound word is 20+ characters long — consider adding a soft hyphen `&shy;` to allow line breaks.",
    },

    // ── Wrong or missing hyphens (guide: häufige Fehler) ─────────────────────
    {
      regex: /\bAstro Projekt\b/g,
      message:
        "Missing hyphen — write `Astro-Projekt`.",
      suggestion: "Astro-Projekt",
    },
    {
      regex: /\bAstro Komponente\b/g,
      message:
        "Missing hyphen — write `Astro-Komponente`.",
      suggestion: "Astro-Komponente",
    },
    {
      regex: /\bAstro Blog\b/g,
      message:
        "Missing hyphen — write `Astro-Blog`.",
      suggestion: "Astro-Blog",
    },
    {
      regex: /\bnpm Paket\b/gi,
      message:
        "Missing hyphen — write `npm-Paket`.",
      suggestion: "npm-Paket",
    },
    {
      regex: /\bReadme Datei\b/gi,
      message:
        "Missing hyphen — write `Readme-Datei`.",
      suggestion: "Readme-Datei",
    },
    {
      regex: /\bE-Mail Adresse\b/g,
      message:
        "Missing hyphen — write `E-Mail-Adresse`.",
      suggestion: "E-Mail-Adresse",
    },
    {
      regex: /\bKonfigurationsoption\b/g,
      message:
        "Per the guide, split long config terms with `&shy;`: `Konfigurations&shy;option`.",
    },

    // ── Terminology: terms that must be translated ────────────────────────────
    {
      regex: /\bbreaking change[s]?\b/gi,
      message:
        "`breaking changes` should be translated to `inkompatible Änderungen`.",
      suggestion: "inkompatible Änderungen",
    },
    {
      regex: /\bdeployen\b/gi,
      message:
        "`deployen` should be `veröffentlichen`.",
      suggestion: "veröffentlichen",
    },
    {
      regex: /\bausliefern\b/gi,
      message:
        "Avoid `ausliefern` (ambiguous) — prefer `veröffentlichen`.",
      suggestion: "veröffentlichen",
    },
    {
      regex: /\bhydrieren\b/gi,
      message:
        "`hydrieren` is the chemistry verb — use `hydratisieren` in the web-development context.",
      suggestion: "hydratisieren",
    },
    {
      regex: /\bHydrierung\b/g,
      message:
        "`Hydrierung` is a chemistry term — use `Hydratation` in the web-development context.",
      suggestion: "Hydratation",
    },
    {
      regex: /\bWebseite\b/g,
      message:
        "Use `Website` for a whole domain or `Seite` for a single page — not `Webseite` (per Duden).",
    },
    {
      regex: /\bmit Hilfe\b/g,
      message:
        "`mit Hilfe` should be one word — `mithilfe` (per Duden).",
      suggestion: "mithilfe",
    },

    // ── Terminology: terms that must NOT be translated ────────────────────────
    {
      regex: /\bAstro[- ]Insel(?:n)?\b/gi,
      message:
        "Don't translate `Islands` to German — per the guide, write `Astro Islands` (the word stays in English).",
      suggestion: "Astro Islands",
    },
    {
      regex: /\bInhalt(?:s)?sammlung\b/gi,
      message:
        "`Inhaltssammlung` is only an optional parenthetical clarifier — use `Content-Collection` as the primary term.",
    },

    // ── Inclusive language (guide: Stilrichtlinien) ───────────────────────────
    {
      regex:
        /\b(einfach|simpel|einfache|einfachem|einfachen|einfacher|einfaches|simple|simpler)\b/gi,
      message:
        "Avoid `einfach`/`simpel` — these terms can make readers feel excluded; please rephrase.",
    },
    {
      regex:
        /\b(Developer\*innen|Entwickler\*innen|Entwickler:innen|Developer:innen)\b/gi,
      message:
        "Avoid gendered `*innen`/`:innen` forms — the guide asks for gender-neutral language instead.",
    },
  ],
};
