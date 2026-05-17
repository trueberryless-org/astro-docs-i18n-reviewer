export interface ReviewOptions {
  prUrlOrNumber: string;
  githubToken: string;
}

export interface PRDetails {
  owner: string;
  repo: string;
  number: number;
}

export interface InlineComment {
  path: string;
  line: number;
  body: string;
}

export interface FileCheckResult {
  filename: string;
  status: "passed" | "failed";
  comments: InlineComment[];
}

export interface TranslationReport {
  prNumber: number;
  author: string;
  reviewBody: string;
  inlineComments: InlineComment[];
  fileReports: FileCheckResult[];
  unsupportedLocales: string[];
}

export interface RulePattern {
  regex: RegExp;
  message: string;
  suggestion?: string;
}

export interface LanguageRule {
  locale: string;
  guideUrl?: string;
  patterns: RulePattern[];
}

export interface RepoConfig {
  extractLocale: (path: string) => string;
  toOriginalPath: (path: string) => string;
}
