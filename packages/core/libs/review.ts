import { Octokit } from "@octokit/core";

import { LANGUAGES, commonPatterns } from "../rules";
import { parseAddedLineNumbers } from "./diff";
import {
  fetchFileContent,
  fetchPullRequest,
  fetchPullRequestFiles,
  parsePullRequest,
} from "./github";
import { getHeadingStructureComments } from "./headings";
import { getLinkComments } from "./links";
import { DEFAULT_LOCALE, getRepoConfig, isDefaultLocale } from "./repo";
import { getRuleComments } from "./rules";
import { stripCodeContent, stripNonProseContent } from "./strip";
import { getStructureComments } from "./structure";
import type {
  FileCheckResult,
  LanguageRule,
  ReviewComment,
  ReviewOptions,
  TranslationReport,
} from "./types";
import { getUntranslatedContentComments } from "./untranslated";

const MARKDOWN_EXTENSION_RE = /\.mdx?$/;

const LOCALES = new Set([DEFAULT_LOCALE, ...LANGUAGES.keys()]);

export async function runTranslationReview({
  githubToken,
  prUrlOrNumber,
}: ReviewOptions): Promise<TranslationReport> {
  const details = parsePullRequest(prUrlOrNumber);
  const octokit = new Octokit({ auth: githubToken });
  const repoConfig = getRepoConfig(details.owner, details.repo);

  const [pullRequest, files] = await Promise.all([
    fetchPullRequest(octokit, details),
    fetchPullRequestFiles(octokit, details),
  ]);

  const fileReports: FileCheckResult[] = [];
  const unsupportedLocales = new Set<string>();

  for (const file of files) {
    if (!isReviewableFile(file.filename, file.status)) continue;

    const locale = repoConfig.getLocale(file.filename);
    if (isDefaultLocale(locale)) continue;

    const ruleset = LANGUAGES.get(locale);
    if (!ruleset) {
      unsupportedLocales.add(locale);
      continue;
    }

    const [translatedContent, originalContent] = await Promise.all([
      fetchFileContent(octokit, details, file.filename, pullRequest.head.sha),
      fetchFileContent(
        octokit,
        details,
        repoConfig.getOriginalPath(file.filename),
        pullRequest.base.sha
      ),
    ]);

    fileReports.push(
      reviewTranslationFile({
        originalContent,
        patch: file.patch,
        path: file.filename,
        ruleset,
        siteUrl: repoConfig.siteUrl,
        translatedContent: translatedContent ?? "",
      })
    );
  }

  return {
    author: pullRequest.user.login,
    fileReports,
    prNumber: details.number,
    unsupportedLocales: [...unsupportedLocales],
  };
}

export function reviewTranslationFile({
  originalContent,
  patch,
  path,
  ruleset,
  siteUrl,
  translatedContent,
}: TranslationFile): FileCheckResult {
  const addedLines = patch ? parseAddedLineNumbers(patch) : undefined;
  const ruleOptions = { addedLines, path };

  const comments: ReviewComment[] = [
    ...(originalContent === undefined
      ? []
      : [
          ...getHeadingStructureComments(
            originalContent,
            translatedContent,
            path
          ),
          ...getStructureComments(
            originalContent,
            translatedContent,
            path,
            addedLines
          ),
          ...getUntranslatedContentComments(
            originalContent,
            translatedContent,
            path,
            addedLines
          ),
        ]),
    ...getLinkComments(translatedContent, stripCodeContent(translatedContent), {
      ...ruleOptions,
      locale: ruleset.locale,
      locales: LOCALES,
      mdnLocale: ruleset.mdnLocale,
      siteUrl,
    }),
    ...getRuleComments(
      translatedContent,
      stripNonProseContent(translatedContent),
      [...commonPatterns, ...ruleset.patterns],
      ruleOptions
    ),
  ];

  return {
    comments,
    filename: path,
    ...(ruleset.guideUrl ? { guideUrl: ruleset.guideUrl } : {}),
    status: comments.length === 0 ? "passed" : "failed",
  };
}

function isReviewableFile(path: string, status: string) {
  return status !== "removed" && MARKDOWN_EXTENSION_RE.test(path);
}

interface TranslationFile {
  originalContent: string | undefined;
  patch: string | undefined;
  path: string;
  ruleset: LanguageRule;
  siteUrl: string;
  translatedContent: string;
}
