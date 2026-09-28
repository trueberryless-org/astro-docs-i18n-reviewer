import type { LanguageRule } from "../libs/types";
import { arRules } from "./ar";
import { deRules } from "./de";
import { frRules } from "./fr";
import { itRules } from "./it";
import { jaRules } from "./ja";
import { koRules } from "./ko";
import { ptBrRules } from "./pt-br";
import { ruRules } from "./ru";
import { zhCnRules } from "./zh-cn";
import { zhTwRules } from "./zh-tw";

export { commonPatterns } from "./common";

export const LANGUAGES = new Map<string, LanguageRule>([
  ["ar", arRules],
  ["de", deRules],
  ["fr", frRules],
  ["it", itRules],
  ["ja", jaRules],
  ["ko", koRules],
  ["pt-br", ptBrRules],
  ["ru", ruRules],
  ["zh-cn", zhCnRules],
  ["zh-tw", zhTwRules],
]);
