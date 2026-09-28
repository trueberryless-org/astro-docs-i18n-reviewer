import { describe, expect, test } from "vitest";

import { getLinkComments, slugifyHeading } from "../../libs/links";
import { stripCodeContent } from "../../libs/strip";

const options: LinkOptions = {
  addedLines: undefined,
  locale: "es",
  locales: new Set(["en", "es", "fr"]),
  path: "src/content/docs/es/page.mdx",
  siteUrl: "https://docs.astro.build",
};

type LinkOptions = Parameters<typeof getLinkComments>[2];

function getComments(content: string, overrides: Partial<LinkOptions> = {}) {
  return getLinkComments(content, stripCodeContent(content), {
    ...options,
    ...overrides,
  });
}

describe("getLinkComments", () => {
  test("returns no comments for valid links", () => {
    const content = [
      "## Enrutamiento dinámico",
      "",
      "Ver [rutas](/es/guides/routing/#rutas-dinámicas), [el enrutamiento](#enrutamiento-dinámico),",
      "[la imagen](/logo.png), [MDN](https://developer.mozilla.org/) y `[código](/en/)`.",
      "",
      "```md",
      "[ejemplo](/en/)",
      "```",
    ].join("\n");

    expect(getComments(content)).toEqual([]);
  });

  test("reports links to other locales with a suggestion", () => {
    const [comment] = getComments("Ver [rutas](/en/guides/routing/) y [más](/fr/).");

    expect(comment?.body).toContain("Internal link to `/en/` found — please update it to `/es/`.");
    expect(comment?.body).toContain("```suggestion\nVer [rutas](/es/guides/routing/) y [más](/fr/).\n```");
    expect(comment?.body).toContain("This occurs 2 times");
  });

  test("reports links in HTML attributes", () => {
    expect(getComments('<LinkCard href="/en/guides/routing/" />')).toHaveLength(1);
  });

  test("reports links without a locale", () => {
    const [comment] = getComments("Ver [guías](/guides/i18n/).", {
      siteUrl: "https://starlight.astro.build",
    });

    expect(comment?.body).toContain("`/guides/i18n/` doesn't start with `/es/`");
    expect(comment?.body).toContain("Ver [guías](/es/guides/i18n/).");
  });

  test("reports absolute links to the docs site", () => {
    const [comment] = getComments("Ver [rutas](https://docs.astro.build/en/guides/routing/#rutas).");

    expect(comment?.body).toContain("instead of the full `https://docs.astro.build` URL");
    expect(comment?.body).toContain("Ver [rutas](/es/guides/routing/#rutas).");
  });

  test("reports missing trailing slashes", () => {
    const [comment] = getComments("Ver [rutas](/es/guides/routing#rutas).");

    expect(comment?.body).toContain("trailing slash");
    expect(comment?.body).toContain("Ver [rutas](/es/guides/routing/#rutas).");
  });

  test("reports fragments that don't match a heading of the page", () => {
    const content = ["## Rutas dinámicas", "", "Ver [rutas](#dynamic-routes)."].join("\n");

    const comments = getComments(content);

    expect(comments).toHaveLength(1);
    expect(comments[0]?.line).toBe(3);
    expect(comments[0]?.body).toContain("`#dynamic-routes`");
  });

  test("ignores lines outside the added lines", () => {
    expect(getComments("Ver [rutas](/en/).", { addedLines: new Set([2]) })).toEqual([]);
  });
});

describe("slugifyHeading", () => {
  test("slugifies headings like the docs sites", () => {
    expect(slugifyHeading("Display unprocessed images with the HTML `<img>` tag")).toBe(
      "display-unprocessed-images-with-the-html-img-tag"
    );
    expect(slugifyHeading("<Code />")).toBe("code-");
    expect(slugifyHeading("Aktualisierungs&shy;anleitungen")).toBe("aktualisierungsanleitungen");
    expect(slugifyHeading("[Astro DB](/es/guides/astro-db/) y más")).toBe("astro-db-y-más");
    expect(slugifyHeading("変更: scriptとstyleタグ")).toBe("変更-scriptとstyleタグ");
  });
});
