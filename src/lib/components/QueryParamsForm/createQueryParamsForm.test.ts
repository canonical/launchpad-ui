import { numCodec, strCodec, superhref } from "@canonical/superhref";
import { describe, expect, it } from "vitest";
import { paginationCodecs } from "$lib/codecs/paginationCodecs.js";
import { createQueryParamsForm } from "./createQueryParamsForm.js";
import type {
  FormDataEntries,
  FormDataPatch,
} from "./createQueryParamsForm.js";

const schema = superhref({
  "binary-package": strCodec(),
  sort: strCodec(),
  view: strCodec({ default: "all" }),
  series: strCodec(),
  ...paginationCodecs({ defaultSize: 25, maxSize: 100 }),
});

type Param = keyof ReturnType<typeof schema.parse> & string;

const url = new URL(
  "https://example.test/ubuntu/+source?sort=series&page=3&utm=x",
);

describe("createQueryParamsForm", () => {
  it("returns entries for every param not listed in replaceParams", () => {
    expect(
      createQueryParamsForm(schema, url, ["page-size", "page"]).preserveParams,
    ).toEqual([
      ["sort", "series"],
      ["utm", "x"],
    ]);
  });

  it("drops a replacement value that serializes to the default", () => {
    expect(submit(["page-size", "page"], [["page-size", "25"]])).toEqual({
      "page-size": [],
    });
  });

  it("writes submitted replacements and clears listed params with no control", () => {
    expect(submit(["page-size", "page"], [["page-size", "50"]])).toEqual({});
  });

  it("keeps the params not listed in replaceParams", () => {
    expect(submit(["page"], [["page", "4"]])).toEqual({});
  });

  it("keeps repeated preserved params in order across submissions", () => {
    const repeatedUrl = new URL(
      "https://example.test/ubuntu/+source?series=one&utm=a&series=two&sort=series&utm=b&page=3",
    );
    const form = createQueryParamsForm(schema, repeatedUrl, ["page"]);
    const entries = [...form.preserveParams, ["page", "4"]] as const;

    expect(form.preserveParams).toEqual([
      ["series", "one"],
      ["utm", "a"],
      ["series", "two"],
      ["sort", "series"],
      ["utm", "b"],
    ]);
    expect(form.patch(entries)).toEqual({});
    expect(form.patch(entries)).toEqual({});
  });

  it("leaves submitted values outside replaceParams unchanged", () => {
    const repeatedUrl = new URL(
      "https://example.test/ubuntu/+source?series=one&series=&series=two",
    );
    const form = createQueryParamsForm(schema, repeatedUrl, ["page"]);

    expect(
      form.patch([
        ["series", "changed"],
        ["page", "004"],
      ]),
    ).toEqual({ page: ["4"] });
  });

  it("passes new schema-known fields through without normalizing or omitting defaults", () => {
    expect(
      submit(
        ["page"],
        [
          ["series", ""],
          ["series", "changed"],
          ["view", "all"],
          ["page-size", "0025"],
          ["page", "004"],
        ],
      ),
    ).toEqual({ page: ["4"] });
  });

  it("leaves all submitted values unchanged when replaceParams is empty", () => {
    expect(
      submit(
        [],
        [
          ["page", "004"],
          ["series", "changed"],
        ],
      ),
    ).toEqual({});
  });

  it("never adds a key the form did not carry", () => {
    expect(submit(["page"], [["page", "4"]])).not.toHaveProperty("view");
  });

  it("canonicalizes replacement values through the codecs", () => {
    expect(
      submit(
        ["page-size", "page"],
        [
          ["page-size", "500"],
          ["page", "007"],
        ],
      ),
    ).toEqual({ "page-size": ["100"], page: ["7"] });
  });

  it("reads the first of repeated entries", () => {
    expect(
      submit(
        ["page"],
        [
          ["page", "3"],
          ["page", "9"],
        ],
      ),
    ).toEqual({ page: ["3"] });
  });

  it("clears a param listed in replaceParams with no control", () => {
    const panelUrl = new URL(
      "https://example.test/ubuntu/+source?binary-package=zsh&page=2",
    );
    const form = createQueryParamsForm(schema, panelUrl, ["binary-package"]);

    expect(form.preserveParams).toEqual([["page", "2"]]);
    expect(form.patch(form.preserveParams)).toEqual({});
  });

  it("passes a control the schema does not own through untouched", () => {
    expect(
      submit(
        ["page"],
        [
          ["foo", "1"],
          ["page", "007"],
        ],
      ),
    ).toEqual({ page: ["7"] });
  });

  it("returns only the names whose values differ", () => {
    expect(
      submit(
        ["page-size", "page"],
        [
          ["page-size", "50"],
          ["page", "007"],
        ],
      ),
    ).toEqual({ page: ["7"] });
  });

  describe("sections", () => {
    const sectioned = superhref({
      panel: strCodec(),
      bugs: {
        page: numCodec({ default: 1, integer: true, min: 1 }),
        q: strCodec(),
      },
    });
    const sectionUrl = new URL(
      "https://example.test/app?panel=bugs&bugs.page=3&bugs.q=crash&utm=x",
    );

    it("preserves every param outside a listed section", () => {
      expect(
        createQueryParamsForm(sectioned, sectionUrl, ["bugs"]).preserveParams,
      ).toEqual([
        ["panel", "bugs"],
        ["utm", "x"],
      ]);
    });

    it("replaces the section keys through their codecs", () => {
      const form = createQueryParamsForm(sectioned, sectionUrl, ["bugs"]);

      expect(
        form.patch([...form.preserveParams, ["bugs.page", "007"]]),
      ).toEqual({ "bugs.page": ["7"] });
    });

    it("passes controls in an unlisted section through unchanged", () => {
      const form = createQueryParamsForm(sectioned, sectionUrl, ["panel"]);

      expect(form.preserveParams).toEqual([
        ["bugs.page", "3"],
        ["bugs.q", "crash"],
        ["utm", "x"],
      ]);
      expect(
        form.patch([...form.preserveParams, ["bugs.page", "009"]]),
      ).toEqual({});
    });
  });
});

function submit(
  replaceParams: readonly Param[],
  fields: FormDataEntries,
): FormDataPatch {
  const form = createQueryParamsForm(schema, url, replaceParams);
  return form.patch([...form.preserveParams, ...fields]);
}
