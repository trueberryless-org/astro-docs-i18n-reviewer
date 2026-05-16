import type { LanguageRule } from "../types.js";

export const frRules: LanguageRule = {
  locale: "fr",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/fran%C3%A7ais.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/fr/`.",
    },
    {
      regex: /:::(remarque|astuce|attention|avertissement|avis|conseil|danger|note-fr)\b/gi,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Typography ───────────────────────────────────────────────────────────
    {
      regex: /"[^"\n]+"/g,
      message:
        "Use French guillemets `«\u00a0…\u00a0»` instead of straight double quotes `\"…\"`.",
    },

    // ── Terms that MUST be translated ────────────────────────────────────────
    {
      regex: /\bbreaking changes?\b/gi,
      message:
        "`breaking changes` should be translated to `changements non rétrocompatibles` or `changements avec rupture de compatibilité`.",
      suggestion: "changements non rétrocompatibles",
    },
    {
      regex: /\bchangelog\b/gi,
      message:
        "`changelog` should be translated to `journal des modifications`.",
      suggestion: "journal des modifications",
    },
    {
      regex: /\bclient-side\b/gi,
      message:
        "`client-side` should be translated to `côté client`.",
      suggestion: "côté client",
    },
    {
      regex: /\bserver-side\b/gi,
      message:
        "`server-side` should be translated to `côté serveur`.",
      suggestion: "côté serveur",
    },
    {
      regex: /\bendpoints?\b/gi,
      message:
        "`endpoint` should be translated to `point de terminaison`.",
      suggestion: "point de terminaison",
    },
    {
      regex: /\blayout\b/gi,
      message:
        "`layout` should be translated to `mise en page`.",
      suggestion: "mise en page",
    },
    {
      regex: /\bplugins?\b/gi,
      message:
        "`plugin` should be translated to `module d'extension`.",
      suggestion: "module d'extension",
    },
    {
      regex: /\bpresets?\b/gi,
      message:
        "`preset` should be translated to `préréglage`.",
      suggestion: "préréglage",
    },
    {
      regex: /\brepository\b/gi,
      message:
        "`repository` should be translated to `dépôt`.",
      suggestion: "dépôt",
    },
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `routage`.",
      suggestion: "routage",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `transitions de vue`.",
      suggestion: "transitions de vue",
    },
    {
      regex: /\bbundles?\b/gi,
      message:
        "`bundle` should be translated to `regroupement` (noun) or `regrouper` (verb).",
      suggestion: "regroupement",
    },
    {
      regex: /\bon-demand rendering\b/gi,
      message:
        "`on-demand rendering` should be translated to `rendu à la demande`.",
      suggestion: "rendu à la demande",
    },
    {
      regex: /\bpackages?\b/gi,
      message:
        "`package` should be translated to `paquet`.",
      suggestion: "paquet",
    },
    {
      regex: /\bupdate\b/gi,
      message:
        "`update` should be translated to `mise à jour`.",
      suggestion: "mise à jour",
    },
    {
      regex: /\bupgrade\b/gi,
      message:
        "`upgrade` should be translated to `mise à niveau`.",
      suggestion: "mise à niveau",
    },
    {
      regex: /\bdeprecated?\b/gi,
      message:
        "`deprecated` should be translated to `déprécié` (not `obsolète` — that's for outdated content).",
      suggestion: "déprécié",
    },
    {
      regex: /\bassets?\b/gi,
      message:
        "`assets` should be translated to `ressources` (not `actifs` — that has a financial connotation).",
      suggestion: "ressources",
    },
    {
      regex: /\brenders?\b/gi,
      message:
        "`render` should be translated to `afficher`, `générer`, `effectuer un rendu`, or `restituer` depending on context.",
    },
    {
      regex: /\brendering\b/gi,
      message:
        "`rendering` should be translated to `rendu`, `affichage`, or `restitution` depending on context.",
      suggestion: "rendu",
    },

    // ── Terms that must NOT be translated ────────────────────────────────────
    {
      regex: /\b(cadriciel|intergiciel|logiciel\s+médiateur)\b/gi,
      message:
        "`cadriciel` / `intergiciel` are over-translations — keep the English `framework` / `middleware` instead.",
    },
    {
      regex: /\bfrontaux?\b/gi,
      message:
        "`frontal` is rarely used — keep `front-end` in English per the guide.",
    },
    {
      regex: /\bdorsaux?\b/gi,
      message:
        "`dorsal` is rarely used — keep `back-end` in English per the guide.",
    },
    {
      regex: /\bcrochet\b/gi,
      message:
        "`crochet` is too literal for `hook` — the guide recommends keeping `hook` in English.",
    },
    {
      regex: /\bILC\b/g,
      message:
        "`ILC` is not used — keep `CLI` in the French docs.",
      suggestion: "CLI",
    },
    {
      regex: /\bglobaux?\b/gi,
      message:
        "`global/globaux` looks like a mistranslation of `glob` — `glob` should stay untranslated (it's a proper noun / function name).",
    },
    {
      regex: /\bstyliser\b/gi,
      message:
        "`styliser` is an anglicism — use `mettre en forme` or `appliquer des styles` instead.",
      suggestion: "mettre en forme",
    },
    {
      regex: /\bsupporter\b/gi,
      message:
        "`supporter` is an anglicism in this context — use `prendre en charge` or `être compatible avec`.",
      suggestion: "prendre en charge",
    },
    {
      regex: /\ben ligne\b/gi,
      message:
        "`en ligne` is almost always wrong for `inline` — use `au sein de`, `dans le corps`, or `intégré à` depending on context.",
    },
    {
      regex: /\bÎles Astro\b/gi,
      message:
        "The canonical French term is `Îlots Astro` (not `Îles Astro`) — see the guide discussion.",
      suggestion: "Îlots Astro",
    },
    {
      regex: /\bArchitecture en [Îî]les\b/gi,
      message:
        "Use `Architecture en îlots` (not `en îles`) to match the `Îlots Astro` naming.",
      suggestion: "Architecture en îlots",
    },
  ],
};
