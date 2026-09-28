import { describe, expect, test } from "vitest";

import { getRuleComments } from "../../libs/rules";
import { stripNonProseContent } from "../../libs/strip";
import { commonPatterns, LANGUAGES } from "../../rules";

function getMessages(locale: string, content: string) {
  const ruleset = LANGUAGES.get(locale);
  if (!ruleset) throw new Error(`Missing ruleset for \`${locale}\`.`);

  return getRuleComments(
    content,
    stripNonProseContent(content),
    [...commonPatterns, ...ruleset.patterns],
    { addedLines: undefined, path: "file.md" }
  ).map(({ body }) => body);
}

describe("LANGUAGES", () => {
  test("defines a ruleset for every locale of the Astro and Starlight docs", () => {
    expect([...LANGUAGES.keys()].toSorted()).toEqual([
      "ar",
      "da",
      "de",
      "es",
      "fa",
      "fr",
      "hi",
      "id",
      "it",
      "ja",
      "ko",
      "pl",
      "pt-br",
      "pt-pt",
      "ru",
      "tr",
      "uk",
      "zh-cn",
      "zh-tw",
    ]);
  });

  test("uses rules that never match an empty string", () => {
    for (const [locale, { patterns }] of LANGUAGES) {
      for (const { regex } of patterns) {
        expect(new RegExp(regex).test(""), `${locale}: ${regex}`).toBe(false);
      }
    }
  });
});

describe.each([
  ["es", "Asegúrese de instalar la librería.", ["`Asegúrate`", "`biblioteca`"]],
  ["es", "Para que se ejecute, asegúrate de usar la API.", []],
  ["es", "Qué es Astro? ¿Qué es Starlight?", ["opening question mark"]],
  ["es", "Configura el API y la frontmatter.", ["`la API`", "`el frontmatter`"]],
  ["pl", "Uruchom komendę w twoim projekcie.", ["`polecenie`", "`Twój`"]],
  ["pl", "Uruchom polecenie w Twoim projekcie.", []],
  ["hi", "एस्ट्रो एक फ्रेमवर्क है.", ["`Astro`", "purna viram"]],
  ["hi", "Astro एक फ्रेमवर्क है।", []],
  ["uk", "Це являється прикладом на протязі року.", ["`є`", "`протягом`"]],
  ["uk", "Це є прикладом протягом року.", []],
  ["uk", "Это пример.", ["don't exist in Ukrainian"]],
  ["tr", "Astronun yapılandırması herhangibir dosyada.", ["apostrophe", "`herhangi bir`"]],
  ["tr", "Astro'nun yapılandırması herhangi bir dosyada.", []],
  ["fa", "این فايل را باز كنید و می شود", ["`ی`", "`ک`", "`می`"]],
  ["fa", "این فایل را باز کنید و می‌شود", []],
  ["id", "Simpan disini jika anda ingin merubah konfigurasi.", ["`di sini`", "`Anda`", "`mengubah`"]],
  ["id", "Simpan di sini jika Anda ingin mengubah konfigurasi.", []],
  ["da", "Opret et Astro projekt, som De kan bruge.", ["hyphen", "`du`"]],
  ["da", "Opret et Astro-projekt, som du kan bruge.", []],
  ["pt-pt", "Abra o arquivo e está carregando o usuário.", ["`ficheiro`", "`estar a`", "`utilizador`"]],
  ["pt-pt", "Abra o ficheiro e está a carregar o utilizador.", []],
  ["de", "Hier kannst Du die Site von Astro's Projekt sehen.", ["lowercase", "`Website`", "`Astros`"]],
  ["ja", "実行して下さい。", ["`ください`"]],
  ["zh-tw", "請在默認設置中添加組件。", ["`預設`", "`設定`", "`新增`", "`元件`"]],
  ["ar", "يمكنك إستخدام المكون و يمكنك ايضا", ["hamzat al-wasl", "`أيضًا`", "`و`"]],
  ["fr", "Utilisez l'interface en ligne de commande et les styles globaux.", []],
  ["zh-cn", "在 frontmatter 中定义 slug。", []],
])("%s: %s", (locale, content, expected) => {
  test(expected.length > 0 ? "reports the mistakes" : "reports nothing", () => {
    const messages = getMessages(locale, content);

    expect(messages).toHaveLength(expected.length);
    for (const fragment of expected) {
      expect(messages.some((message) => message.includes(fragment)), fragment).toBe(true);
    }
  });
});
