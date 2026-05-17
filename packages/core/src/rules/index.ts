import type { LanguageRule, RepoConfig } from "../types.js";
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

// Matches a locale segment inside a content/docs path, e.g. /content/docs/de/
const LOCALE_SEGMENT_RE = /\/content\/docs\/([a-z]{2,3}(?:-[a-z]+)?)\//;

// withastro/docs — translated files live at src/content/docs/{locale}/...
//                  English files live at src/content/docs/en/...
const docsRepoConfig: RepoConfig = {
  extractLocale(path: string): string {
    return path.match(LOCALE_SEGMENT_RE)?.[1] ?? "en";
  },
  toOriginalPath(path: string): string {
    return path.replace(LOCALE_SEGMENT_RE, "/content/docs/en/");
  },
};

// withastro/starlight — translated files live at docs/src/content/docs/{locale}/...
//                       English files live at docs/src/content/docs/... (no locale segment)
const starlightRepoConfig: RepoConfig = {
  extractLocale(path: string): string {
    return path.match(LOCALE_SEGMENT_RE)?.[1] ?? "en";
  },
  toOriginalPath(path: string): string {
    return path.replace(LOCALE_SEGMENT_RE, "/content/docs/");
  },
};

export function getRepoConfig(owner: string, repo: string): RepoConfig {
  if (owner === "withastro" && repo === "starlight") return starlightRepoConfig;
  return docsRepoConfig;
}

// Kept for backward compatibility with any external callers.
export function extractLocaleFromPath(path: string): string {
  return docsRepoConfig.extractLocale(path);
}

export function guessOriginalPath(translatedPath: string): string {
  return docsRepoConfig.toOriginalPath(translatedPath);
}
