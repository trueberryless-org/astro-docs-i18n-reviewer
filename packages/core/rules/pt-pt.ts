import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const ptPtRules: LanguageRule = {
  locale: "pt-pt",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Brazilian Portuguese terms (use European Portuguese instead) ─────────
    ...(
      [
        ["arquivos?", "ficheiro"],
        ["telas?", "ecrã"],
        ["usuári[oa]s?", "utilizador"],
        ["registros?", "registo"],
        ["contatos?", "contacto"],
        ["equipes?", "equipa"],
        ["baixar", "transferir"],
        ["salvar", "guardar"],
        ["compartilh\\p{L}*", "partilhar"],
        ["celulare?s?", "telemóvel"],
        ["acessar", "aceder"],
        ["cadastr\\p{L}*", "registar"],
      ] satisfies [string, string][]
    ).map(([brazilian, european]) => ({
      regex: matchWord(brazilian),
      message: `This is Brazilian Portuguese — use the European Portuguese \`${european}\` instead.`,
    })),

    // ── Progressive: European Portuguese uses `a` + infinitive ───────────────
    {
      regex: matchWord(
        "(?:est(?:ou|ás|á|amos|ão|ava|avam|ar)) \\p{L}+[aei]ndo"
      ),
      message:
        "European Portuguese uses `estar a` + infinitive (e.g. `está a carregar`) instead of the gerund (`está carregando`).",
    },
  ],
};
