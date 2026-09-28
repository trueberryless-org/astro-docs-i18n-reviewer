import { matchWord } from "../libs/rules";
import type { LanguageRule } from "../libs/types";

export const idRules: LanguageRule = {
  locale: "id",
  guideUrl: "https://contribute.docs.astro.build/guides/i18n/",
  patterns: [
    // ── Tone ─────────────────────────────────────────────────────────────────
    {
      regex: /(?<![\p{L}\p{M}])anda(?![\p{L}\p{M}])/gu,
      message: "Capitalise `Anda` when addressing the reader.",
      suggestion: "Anda",
    },

    // ── The preposition `di`/`ke` is written separately (KBBI) ───────────────
    ...(
      [
        ["disini", "di sini"],
        ["disana", "di sana"],
        ["disitu", "di situ"],
        ["dimana", "di mana"],
        ["kemana", "ke mana"],
        ["darimana", "dari mana"],
        ["diatas", "di atas"],
        ["dibawah", "di bawah"],
        ["didalam", "di dalam"],
        ["kedalam", "ke dalam"],
        ["diluar", "di luar"],
        ["diantara", "di antara"],
      ] satisfies [string, string][]
    ).map(([wrong, correct]) => ({
      regex: matchWord(wrong),
      message: `The preposition is written separately — write \`${correct}\`.`,
      suggestion: correct,
    })),

    // ── Standard spelling (KBBI) ─────────────────────────────────────────────
    ...(
      [
        ["merubah", "mengubah"],
        ["praktek", "praktik"],
        ["aktifitas", "aktivitas"],
        ["resiko", "risiko"],
        ["sistim", "sistem"],
        ["ijin", "izin"],
        ["tehnik", "teknik"],
        ["kwalitas", "kualitas"],
        ["analisa", "analisis"],
        ["diperbaharui", "diperbarui"],
      ] satisfies [string, string][]
    ).map(([wrong, correct]) => ({
      regex: matchWord(wrong),
      message: `Use the standard spelling \`${correct}\` instead of \`${wrong}\`.`,
      suggestion: correct,
    })),

    // ── Names that stay untranslated ─────────────────────────────────────────
    {
      regex: matchWord("Kode Ekspresif"),
      message:
        "`Expressive Code` is the name of a library and should not be translated.",
      suggestion: "Expressive Code",
    },
  ],
};
