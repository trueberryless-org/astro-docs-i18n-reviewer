import { Octokit } from "@octokit/core";
import type { PRDetails, InlineComment, ReviewOptions } from "./types.js";

export function parsePRUrlOrNumber(input: string): PRDetails {
  const cleanInput = input.trim();
  if (/^\d+$/.test(cleanInput))
    return {
      owner: "withastro",
      repo: "docs",
      number: parseInt(cleanInput, 10),
    };

  const urlMatch = cleanInput.match(
    /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
  );
  if (urlMatch)
    return {
      owner: urlMatch[1],
      repo: urlMatch[2],
      number: parseInt(urlMatch[3], 10),
    };

  throw new Error("Invalid PR format.");
}

export async function fetchPRData(octokit: Octokit, details: PRDetails) {
  const prResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    {
      owner: details.owner,
      repo: details.repo,
      pull_number: details.number,
    },
  );
  const filesResponse = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner: details.owner,
      repo: details.repo,
      pull_number: details.number,
      per_page: 100,
    },
  );
  return { pr: prResponse.data, files: filesResponse.data };
}

export async function fetchRawContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  ref: string,
): Promise<string> {
  try {
    const response = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
        ref,
      },
    );
    if (
      "content" in response.data &&
      typeof response.data.content === "string"
    ) {
      const binary = atob(response.data.content.replace(/\s/g, ""));
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
    return "";
  } catch {
    return "";
  }
}

export async function postGitHubReview(
  options: ReviewOptions,
  body: string,
  comments: InlineComment[],
): Promise<void> {
  const details = parsePRUrlOrNumber(options.prUrlOrNumber);
  const octokit = new Octokit({ auth: options.githubToken });

  await octokit.request(
    "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
    {
      owner: details.owner,
      repo: details.repo,
      pull_number: details.number,
      body,
      event: "COMMENT",
      comments: comments.map((c) => ({
        path: c.path,
        line: c.line,
        body: c.body,
        side: "RIGHT",
      })),
    },
  );
}
