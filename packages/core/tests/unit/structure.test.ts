import { describe, expect, test } from "vitest";

import { getStructureComments } from "../../libs/structure";

const original = [
  "---",
  "title: Routing",
  "description: Learn how routing works.",
  "---",
  "",
  "<Tabs>",
  '<Fragment slot="npm">npm</Fragment>',
  "</Tabs>",
].join("\n");

const translation = original.replace(
  "Learn how routing works.",
  "Aprende cómo funciona el enrutamiento."
);

describe("getStructureComments", () => {
  test("returns no comments for a correct translation", () => {
    const translated = original
      .replace("title: Routing", "title: Enrutamiento")
      .replace("Learn how routing works.", "Aprende cómo funciona.");

    expect(getStructureComments(original, translated, "file.md", undefined)).toEqual([]);
  });

  test("reports translated frontmatter property names", () => {
    const translated = translation.replace("title:", "título:");

    const comments = getStructureComments(original, translated, "file.md", undefined);

    expect(comments).toHaveLength(1);
    expect(comments[0]?.line).toBe(2);
    expect(comments[0]?.body).toContain("`título`");
  });

  test("reports an untranslated description", () => {
    const quoted = getStructureComments(
      original,
      original.replace("description: Learn how routing works.", 'description: "Learn how routing works."'),
      "file.md",
      new Set([3])
    );

    expect(quoted).toHaveLength(1);
    expect(quoted[0]?.body).toContain("`description` appears untranslated");
  });

  test("reports translated component and slot names", () => {
    const translated = translation
      .replace("<Tabs>", "<Pestañas>")
      .replace('slot="npm"', 'slot="paquete"');

    const comments = getStructureComments(original, translated, "file.md", undefined);

    expect(comments.map(({ line }) => line)).toEqual([6, 7]);
  });

  test("ignores lines outside the added lines", () => {
    const translated = original.replace("<Tabs>", "<Pestañas>");

    expect(getStructureComments(original, translated, "file.md", new Set([2]))).toEqual([]);
  });
});
