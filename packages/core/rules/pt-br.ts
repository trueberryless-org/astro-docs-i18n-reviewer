import type { LanguageRule } from "../types.js";

export const ptBrRules: LanguageRule = {
  locale: "pt-br",
  guideUrl:
    "https://github.com/withastro/docs/blob/main/i18n-guides/portugu%C3%AAs-do-brasil.md",
  patterns: [
    // ── Structure ────────────────────────────────────────────────────────────
    {
      regex: /\[.*?\]\(\/en\/.*?\)/g,
      message:
        "Internal link to `/en/` found — please update it to `/pt-BR/`.",
    },
    {
      regex: /:::(nota|dica|cuidado|aviso|perigo|atençao|atenção|aviso)\b/gi,
      message:
        "Don't translate aside type names — keep `:::note`, `:::tip`, `:::caution`, `:::danger` in English.",
    },

    // ── Terms that MUST be translated ────────────────────────────────────────
    {
      regex: /\brouting\b/gi,
      message:
        "`routing` should be translated to `roteamento`.",
      suggestion: "roteamento",
    },
    {
      regex: /\bserver-side rendering\b/gi,
      message:
        "`server-side rendering` should be translated to `renderização no lado do servidor`.",
      suggestion: "renderização no lado do servidor",
    },
    {
      regex: /\bclient-side rendering\b/gi,
      message:
        "`client-side rendering` should be translated to `renderização no lado do cliente`.",
      suggestion: "renderização no lado do cliente",
    },
    {
      regex: /\bclient-side\b/gi,
      message:
        "`client-side` should be translated to `lado do cliente`.",
      suggestion: "lado do cliente",
    },
    {
      regex: /\bserver-side\b/gi,
      message:
        "`server-side` should be translated to `lado do servidor`.",
      suggestion: "lado do servidor",
    },
    {
      regex: /\bpartial hydration\b/gi,
      message:
        "`partial hydration` should be translated to `hidratação parcial`.",
      suggestion: "hidratação parcial",
    },
    {
      regex: /\bislands architecture\b/gi,
      message:
        "`islands architecture` should be translated to `arquitetura em ilhas`.",
      suggestion: "arquitetura em ilhas",
    },
    {
      regex: /\bAstro Islands\b/gi,
      message:
        "`Astro Islands` should be translated to `Ilhas Astro`.",
      suggestion: "Ilhas Astro",
    },
    {
      regex: /\bdeprecated\b/gi,
      message:
        "`deprecated` should be translated to `descontinuado`.",
      suggestion: "descontinuado",
    },
    {
      regex: /\bmetadata\b/gi,
      message:
        "`metadata` should be translated to `metadados`.",
      suggestion: "metadados",
    },
    {
      regex: /\bdirectives?\b/gi,
      message:
        "`directive` should be translated to `diretiva`.",
      suggestion: "diretiva",
    },
    {
      regex: /\badapters?\b/gi,
      message:
        "`adapter` should be translated to `adaptador`.",
      suggestion: "adaptador",
    },
    {
      regex: /\bpackage manager\b/gi,
      message:
        "`package manager` should be translated to `gerenciador de pacotes`.",
      suggestion: "gerenciador de pacotes",
    },
    {
      regex: /\bdebugging\b/gi,
      message:
        "`debugging` should be translated to `depuração`.",
      suggestion: "depuração",
    },
    {
      regex: /\bstatic\b/gi,
      message:
        "`static` should be translated to `estático`.",
      suggestion: "estático",
    },
    {
      regex: /\bdynamic\b/gi,
      message:
        "`dynamic` should be translated to `dinâmico`.",
      suggestion: "dinâmico",
    },
    {
      regex: /\bstylesheet\b/gi,
      message:
        "`stylesheet` should be translated to `folha de estilos`.",
      suggestion: "folha de estilos",
    },
    {
      regex: /\baccessibility\b/gi,
      message:
        "`accessibility` should be translated to `acessibilidade`.",
      suggestion: "acessibilidade",
    },
    {
      regex: /\bintegrations?\b/gi,
      message:
        "`integration` should be translated to `integração`.",
      suggestion: "integração",
    },
    {
      regex: /\bcomponents?\b/gi,
      message:
        "`component` should be translated to `componente`.",
      suggestion: "componente",
    },
    {
      regex: /\bview transitions\b/gi,
      message:
        "`view transitions` should be translated to `transições de visualização`.",
      suggestion: "transições de visualização",
    },
  ],
};
