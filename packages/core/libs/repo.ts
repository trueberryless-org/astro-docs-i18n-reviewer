const LOCALE_SEGMENT_RE = /\/content\/docs\/([a-z]{2,3}(?:-[a-z]+)?)\//;

const DEFAULT_LOCALE = "en";

const astroDocsRepoConfig: RepoConfig = {
  getLocale: getLocaleFromPath,
  getOriginalPath(path) {
    return path.replace(LOCALE_SEGMENT_RE, `/content/docs/${DEFAULT_LOCALE}/`);
  },
};

const starlightRepoConfig: RepoConfig = {
  getLocale: getLocaleFromPath,
  getOriginalPath(path) {
    return path.replace(LOCALE_SEGMENT_RE, "/content/docs/");
  },
};

export function getRepoConfig(owner: string, repo: string) {
  return owner === "withastro" && repo === "starlight"
    ? starlightRepoConfig
    : astroDocsRepoConfig;
}

export function isDefaultLocale(locale: string) {
  return locale === DEFAULT_LOCALE;
}

function getLocaleFromPath(path: string) {
  return LOCALE_SEGMENT_RE.exec(path)?.[1] ?? DEFAULT_LOCALE;
}

export interface RepoConfig {
  getLocale: (path: string) => string;
  getOriginalPath: (path: string) => string;
}
