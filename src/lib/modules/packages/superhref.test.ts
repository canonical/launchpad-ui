import { describe, expect, it } from "vitest";
import { createPackagesQueryForm } from "./superhref";
import type { PackagesQueryParam } from "./superhref";

const url = new URL(
  "https://example.test/ubuntu/+source?sort=series&page=3&utm=x",
);

describe("createPackagesQueryForm", () => {
  it("returns entries for every param not listed in replaceParams", () => {
    expect(
      createPackagesQueryForm(url, ["page-size", "page"]).preserveParams,
    ).toEqual([
      ["sort", "series"],
      ["utm", "x"],
    ]);
  });

  it("drops a replacement value that serializes to the default", () => {
    expect(submit(["page-size", "page"], [["page-size", "25"]])).toEqual([
      ["sort", "series"],
      ["utm", "x"],
    ]);
  });

  it("writes submitted replacements and clears listed params with no control", () => {
    expect(submit(["page-size", "page"], [["page-size", "50"]])).toEqual([
      ["sort", "series"],
      ["utm", "x"],
      ["page-size", "50"],
    ]);
  });

  it("keeps the params not listed in replaceParams", () => {
    expect(submit(["page"], [["page", "4"]])).toEqual([
      ["sort", "series"],
      ["utm", "x"],
      ["page", "4"],
    ]);
  });

  it("keeps repeated preserved params in order across submissions", () => {
    const repeatedUrl = new URL(
      "https://example.test/ubuntu/+source?series=one&utm=a&series=two&sort=series&utm=b&page=3",
    );
    const form = createPackagesQueryForm(repeatedUrl, ["page"]);
    const formData = new FormData();
    for (const [name, value] of form.preserveParams)
      formData.append(name, value);
    formData.append("page", "4");
    const expected = [...form.preserveParams, ["page", "4"]];

    form.onformdata({ formData });
    expect(entries(formData)).toEqual(expected);

    form.onformdata({ formData });
    expect(entries(formData)).toEqual(expected);
  });

  it("restores every preserved value when a submitted control overrides it", () => {
    const repeatedUrl = new URL(
      "https://example.test/ubuntu/+source?series=one&series=&series=two",
    );
    const form = createPackagesQueryForm(repeatedUrl, ["page"]);
    const formData = new FormData();
    formData.append("series", "changed");
    formData.append("page", "4");

    form.onformdata({ formData });

    expect(formData.getAll("series")).toEqual(["one", "", "two"]);
    expect(formData.get("page")).toBe("4");
  });

  it("never adds a key the form did not carry", () => {
    expect(
      submit(["page"], [["page", "4"]]).map(([name]) => name),
    ).not.toContain("view");
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
    ).toEqual([
      ["sort", "series"],
      ["utm", "x"],
      ["page-size", "100"],
      ["page", "7"],
    ]);
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
    ).toEqual([
      ["sort", "series"],
      ["utm", "x"],
      ["page", "3"],
    ]);
  });

  it("clears a param listed in replaceParams with no control", () => {
    const panelUrl = new URL(
      "https://example.test/ubuntu/+source?binary-package=zsh&page=2",
    );
    const form = createPackagesQueryForm(panelUrl, ["binary-package"]);
    const formData = new FormData();
    for (const [name, value] of form.preserveParams)
      formData.append(name, value);
    form.onformdata({ formData });

    expect(entries(formData)).toEqual([["page", "2"]]);
  });
});

function submit(
  replaceParams: readonly PackagesQueryParam[],
  fields: [string, string][],
): [string, string][] {
  const form = createPackagesQueryForm(url, replaceParams);
  const formData = new FormData();
  for (const [name, value] of [...form.preserveParams, ...fields]) {
    formData.append(name, value);
  }
  form.onformdata({ formData });
  return entries(formData);
}

function entries(formData: FormData): [string, string][] {
  return Array.from(formData, ([name, value]) => [name, String(value)]);
}
