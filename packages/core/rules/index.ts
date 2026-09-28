import type { LanguageRule } from "../libs/types";
import { arRules } from "./ar";
import { daRules } from "./da";
import { deRules } from "./de";
import { esRules } from "./es";
import { faRules } from "./fa";
import { frRules } from "./fr";
import { hiRules } from "./hi";
import { idRules } from "./id";
import { itRules } from "./it";
import { jaRules } from "./ja";
import { koRules } from "./ko";
import { plRules } from "./pl";
import { ptBrRules } from "./pt-br";
import { ptPtRules } from "./pt-pt";
import { ruRules } from "./ru";
import { trRules } from "./tr";
import { ukRules } from "./uk";
import { zhCnRules } from "./zh-cn";
import { zhTwRules } from "./zh-tw";

export { commonPatterns } from "./common";

export const LANGUAGES = new Map<string, LanguageRule>([
  ["ar", arRules],
  ["da", daRules],
  ["de", deRules],
  ["es", esRules],
  ["fa", faRules],
  ["fr", frRules],
  ["hi", hiRules],
  ["id", idRules],
  ["it", itRules],
  ["ja", jaRules],
  ["ko", koRules],
  ["pl", plRules],
  ["pt-br", ptBrRules],
  ["pt-pt", ptPtRules],
  ["ru", ruRules],
  ["tr", trRules],
  ["uk", ukRules],
  ["zh-cn", zhCnRules],
  ["zh-tw", zhTwRules],
]);
