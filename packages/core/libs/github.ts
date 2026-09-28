import type { Octokit } from "@octokit/core";

import type { PullRequestDetails } from "./types";

const PULL_REQUEST_NUMBER_RE = /^#?(\d+)$/;
const PULL_REQUEST_URL_RE = /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/;
const WHITESPACE_RE = /\s/g;

const FILES_PER_PAGE = 100;

export function parsePullRequest(input: string): PullRequestDetails {
  const value = input.trim();

  const [, number] = PULL_REQUEST_NUMBER_RE.exec(value) ?? [];
  if (number) {
    return {
      number: Number.parseInt(number, 10),
      owner: "withastro",
      repo: "docs",
    };
  }

  const [, owner, repo, urlNumber] = PULL_REQUEST_URL_RE.exec(value) ?? [];
  if (owner && repo && urlNumber) {
    return { number: Number.parseInt(urlNumber, 10), owner, repo };
  }

  throw new Error(
    "Invalid pull request. Enter a GitHub pull request URL or number."
  );
}

export async function fetchPullRequest(
  octokit: Octokit,
  { number, owner, repo }: PullRequestDetails
) {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    { owner, pull_number: number, repo }
  );

  return data;
}

export async function fetchPullRequestFiles(
  octokit: Octokit,
  { number, owner, repo }: PullRequestDetails
) {
  const files = [];

  for (let page = 1; ; page++) {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
      { owner, page, per_page: FILES_PER_PAGE, pull_number: number, repo }
    );

    files.push(...data);

    if (data.length < FILES_PER_PAGE) return files;
  }
}

export async function fetchFileContent(
  octokit: Octokit,
  { owner, repo }: PullRequestDetails,
  path: string,
  ref: string
) {
  try {
    const { data } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      { owner, path, ref, repo }
    );

    return "content" in data && typeof data.content === "string"
      ? decodeBase64(data.content)
      : undefined;
  } catch (error) {
    if (isNotFoundError(error)) return;
    throw error;
  }
}

export function decodeBase64(content: string) {
  const binary = atob(content.replace(WHITESPACE_RE, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 404
  );
}
