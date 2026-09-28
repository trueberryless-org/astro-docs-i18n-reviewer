export interface ReviewOptions {
  githubToken: string;
  prUrlOrNumber: string;
}

export interface PullRequestDetails {
  number: number;
  owner: string;
  repo: string;
}

export interface ReviewComment {
  body: string;
  line: number;
  path: string;
}

export interface FileCheckResult {
  comments: ReviewComment[];
  filename: string;
  guideUrl?: string;
  status: "failed" | "passed";
}

export interface TranslationReport {
  author: string;
  fileReports: FileCheckResult[];
  prNumber: number;
  unsupportedLocales: string[];
}

export interface RulePattern {
  message: string;
  regex: RegExp;
  suggestion?: string;
}

export interface LanguageRule {
  guideUrl?: string;
  locale: string;
  patterns: RulePattern[];
}
