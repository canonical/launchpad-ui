import { describe, expect, it } from "vitest";
import { preserveQueryParams } from "./preserveQueryParams.js";

const attachment = Symbol("attachment");
const form = {
  method: "POST" as const,
  action: "?/remote=abc%2FdeleteTableView",
  [attachment]: () => {},
};

describe("preserveQueryParams", () => {
  it("keeps the page's query params before kit's remote param", () => {
    const url = new URL(
      "http://localhost/ubuntu/+source?panel=manage-views&view=mine",
    );

    expect(preserveQueryParams(form, url)).toEqual({
      ...form,
      action: "?panel=manage-views&view=mine&/remote=abc%2FdeleteTableView",
    });
  });

  it("returns the form unchanged when the page has no query params", () => {
    const url = new URL("http://localhost/ubuntu/+source");

    expect(preserveQueryParams(form, url)).toBe(form);
  });

  it("returns the form unchanged when the page only has a leftover remote param", () => {
    const url = new URL(
      "http://localhost/ubuntu/+source?/remote=abc%2FeditTableView",
    );

    expect(preserveQueryParams(form, url)).toBe(form);
  });

  it("replaces a remote param left over from a previous no-JS submission", () => {
    const url = new URL(
      "http://localhost/ubuntu/+source?panel=manage-views&/remote=abc%2FeditTableView",
    );

    expect(preserveQueryParams(form, url)).toEqual({
      ...form,
      action: "?panel=manage-views&/remote=abc%2FdeleteTableView",
    });
  });
});
