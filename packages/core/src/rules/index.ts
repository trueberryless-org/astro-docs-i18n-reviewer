import type { LanguageRule } from "../types.js";
export { commonPatterns } from "./common.js";
import { deRules } from "./de.js";
import { frRules } from "./fr.js";
import { itRules } from "./it.js";
import { ptBrRules } from "./pt-br.js";
import { ruRules } from "./ru.js";
import { arRules } from "./ar.js";
import { jaRules } from "./ja.js";
import { zhTwRules } from "./zh-tw.js";
import { zhCnRules } from "./zh-cn.js";
import { koRules } from "./ko.js";

export const LANGUAGES: Record<string, LanguageRule> = {
  de: deRules,
  fr: frRules,
  it: itRules,
  "pt-br": ptBrRules,
  ru: ruRules,
  ar: arRules,
  ja: jaRules,
  "zh-tw": zhTwRules,
  "zh-cn": zhCnRules,
  ko: koRules,
};

export function extractLocaleFromPath(path: string): string {
  const parts = path.split("/");
  const docsIndex = parts.indexOf("docs");
  if (docsIndex !== -1 && parts[docsIndex + 1]) {
    return parts[docsIndex + 1];
  }
  return "en";
}

export function guessOriginalPath(translatedPath: string): string {
  return translatedPath.replace(
    /\/docs\/([a-z]{2,3})(-[a-z]+)?\//,
    "/docs/en/",
  );
}
