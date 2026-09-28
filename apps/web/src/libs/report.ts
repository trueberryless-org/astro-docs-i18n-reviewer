import type {
  FileCheckResult,
  ReviewComment,
  TranslationReport,
} from "@astro-docs-i18n-reviewer/core";

const HTML_ESCAPES = new Map([
  ["&", "&amp;"],
  ["<", "&lt;"],
  [">", "&gt;"],
  ['"', "&quot;"],
]);
const HTML_SPECIAL_CHARACTER_RE = /[&<>"]/g;

export function getReportMeta({ author, prNumber }: TranslationReport) {
  return `PR #${prNumber} · @${author}`;
}

export function getReportStatsHtml({ fileReports }: TranslationReport) {
  const failedFileCount = fileReports.filter(isFailedFile).length;

  return [
    `<span class="stat"><strong>${fileReports.length}</strong> files reviewed</span>`,
    `<span class="stat-sep">·</span>`,
    `<span class="stat"><strong>${failedFileCount}</strong> with suggestions</span>`,
    `<span class="stat-sep">·</span>`,
    `<span class="stat"><strong>${getSuggestionCount(fileReports)}</strong> total suggestions</span>`,
  ].join("");
}

export function getReportFilesHtml(
  { fileReports, unsupportedLocales }: TranslationReport,
  supportedLocales: string[]
) {
  const unsupportedLocalesHtml =
    unsupportedLocales.length > 0
      ? getUnsupportedLocalesHtml(unsupportedLocales, supportedLocales)
      : "";

  if (fileReports.length === 0) {
    return unsupportedLocalesHtml || getNoTranslationFilesHtml();
  }

  return `${fileReports.map(getFileReportHtml).join("")}${unsupportedLocalesHtml}`;
}

export function getReportMarkdown({
  author,
  fileReports,
  prNumber,
}: TranslationReport) {
  const lines = [
    `## Translation Review — PR #${prNumber}`,
    "",
    `**Author:** @${author}  `,
    `**Files reviewed:** ${fileReports.length}  `,
    `**Total suggestions:** ${getSuggestionCount(fileReports)}`,
    "",
    "---",
    "",
  ];

  for (const file of fileReports) {
    if (!isFailedFile(file)) {
      lines.push(`### ✅ \`${file.filename}\``, "No issues found.", "");
      continue;
    }

    lines.push(
      `### ⚠️ \`${file.filename}\` — ${formatSuggestionCount(file.comments.length)}`
    );

    if (file.guideUrl) {
      lines.push(
        "",
        `See the [i18n guide](${file.guideUrl}) for the full terminology reference.`
      );
    }

    for (const comment of sortCommentsByLine(file.comments)) {
      lines.push("", `**Line ${comment.line}:** ${comment.body}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

function getFileReportHtml(file: FileCheckResult) {
  const isFailed = isFailedFile(file);
  const commentsHtml = sortCommentsByLine(file.comments)
    .map(getCommentHtml)
    .join("");
  const guideHtml =
    isFailed && file.guideUrl
      ? `<a class="guide-link" href="${escapeHtml(file.guideUrl)}" target="_blank" rel="noopener noreferrer">i18n guide ↗</a>`
      : "";
  const badgeHtml = isFailed
    ? `<span class="badge badge-fail">${formatSuggestionCount(file.comments.length)}</span>`
    : '<span class="badge badge-pass">No issues</span>';

  return `
    <div class="file-card ${isFailed ? "failed" : "passed"}">
      <div class="file-header">
        <span class="file-icon">${isFailed ? "⚠️" : "✅"}</span>
        <code class="file-path">${escapeHtml(file.filename)}</code>
        ${guideHtml}
        ${badgeHtml}
      </div>
      ${commentsHtml ? `<div class="comments-list">${commentsHtml}</div>` : ""}
    </div>`;
}

function getCommentHtml(comment: ReviewComment) {
  return `
    <div class="comment-item">
      <span class="line-badge">Line ${comment.line}</span>
      <span class="comment-body">${escapeHtml(comment.body)}</span>
    </div>`;
}

function getUnsupportedLocalesHtml(
  unsupportedLocales: string[],
  supportedLocales: string[]
) {
  const verb = unsupportedLocales.length === 1 ? "is" : "are";

  return `
    <div class="empty-state">
      <p>Language ${formatLocaleList(unsupportedLocales)} ${verb} not supported yet.</p>
      <p class="empty-hint">Supported locales: ${formatLocaleList(supportedLocales)}</p>
    </div>`;
}

function getNoTranslationFilesHtml() {
  return `
    <div class="empty-state">
      <p>No translation files found in this PR.</p>
      <p class="empty-hint">Make sure the PR contains <code>.md</code> or <code>.mdx</code> files outside the <code>en/</code> directory (for <code>withastro/docs</code>) or under a locale subfolder (for <code>withastro/starlight</code>).</p>
    </div>`;
}

function formatLocaleList(locales: string[]) {
  return locales
    .map((locale) => `<code>${escapeHtml(locale)}</code>`)
    .join(" ");
}

function formatSuggestionCount(count: number) {
  return `${count} suggestion${count === 1 ? "" : "s"}`;
}

function getSuggestionCount(fileReports: FileCheckResult[]) {
  return fileReports.reduce((count, file) => count + file.comments.length, 0);
}

function sortCommentsByLine(comments: ReviewComment[]) {
  return comments.toSorted((a, b) => a.line - b.line);
}

function isFailedFile(file: FileCheckResult) {
  return file.status === "failed";
}

function escapeHtml(text: string) {
  return text.replace(
    HTML_SPECIAL_CHARACTER_RE,
    (character) => HTML_ESCAPES.get(character) ?? character
  );
}
