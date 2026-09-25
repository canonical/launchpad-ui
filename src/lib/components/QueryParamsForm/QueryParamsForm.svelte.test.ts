import { strCodec, superhref } from "@canonical/superhref";
import type { SuperhrefSchema } from "@canonical/superhref";
import { createRawSnippet } from "svelte";
import type { Component } from "svelte";
import { SvelteURL } from "svelte/reactivity";
import { describe, expect, expectTypeOf, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import { paginationCodecs } from "$lib/utils/paginationCodecs.js";
import QueryParamsForm from "./QueryParamsForm.svelte";
import type { QueryParamsFormProps } from "./types.js";

const codecs = {
  "binary-package": strCodec(),
  sort: strCodec(),
  view: strCodec({ default: "all" }),
  series: strCodec(),
  ...paginationCodecs({ defaultSize: 25, maxSize: 100 }),
};
const schema = superhref(codecs);
const Form = QueryParamsForm as Component<QueryParamsFormProps<typeof codecs>>;

describe("QueryParamsForm component", () => {
  const url = new SvelteURL("https://launchpad.test/ubuntu/+source");
  const baseProps = { schema, url, "aria-label": "Query parameters" };
  const pageControl = createRawSnippet(() => ({
    render: () => '<input name="page" value="004" />',
  }));

  it("submits as a GET form", async () => {
    url.search = "";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(formOf(screen).method).toBe("get");
    expectTypeOf<QueryParamsFormProps<SuperhrefSchema>>().not.toHaveProperty(
      "method",
    );
    expectTypeOf<QueryParamsFormProps<SuperhrefSchema>>().not.toHaveProperty(
      "onformdata",
    );
  });

  it("carries preserved params as hidden inputs", async () => {
    url.search = "?sort=series&page=3&utm=x";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(hiddenInputs(screen)).toEqual([
      ["sort", "series"],
      ["utm", "x"],
    ]);
  });

  it("canonicalizes the submitted params through the codecs", async () => {
    url.search = "?sort=series&page-size=500";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page", "page-size"],
      children: pageControl,
    });

    expect(submitted(screen)).toEqual([
      ["sort", "series"],
      ["page", "4"],
    ]);
  });

  it("preserves repeated params when the formdata event fires", async () => {
    url.search = "?series=one&utm=a&series=two&page=3";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(submitted(screen)).toEqual([
      ["series", "one"],
      ["utm", "a"],
      ["series", "two"],
      ["page", "4"],
    ]);
  });

  it("submits controls outside replaceParams alongside preserved empty and repeated values", async () => {
    url.search = "?series=&series=two&page=3";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: createRawSnippet(() => ({
        render: () =>
          '<div><input name="page" value="004" /><input name="series" value="changed" /></div>',
      })),
    });

    expect(submitted(screen)).toEqual([
      ["series", ""],
      ["series", "two"],
      ["page", "4"],
      ["series", "changed"],
    ]);
  });

  it("updates preserved fields and submission behavior when the URL changes", async () => {
    url.search = "?sort=series&page=3";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: pageControl,
    });

    url.search = "?series=resolute&page=7";
    await expect
      .poll(() => hiddenInputs(screen))
      .toEqual([["series", "resolute"]]);
    expect(submitted(screen)).toEqual([
      ["series", "resolute"],
      ["page", "4"],
    ]);
  });

  it("clears a param in replaceParams when there is no input for a given parameter", async () => {
    url.search = "?binary-package=zsh&sort=series";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["binary-package"],
      children: createRawSnippet(() => ({
        render: () => '<button type="submit">Submit</button>',
      })),
    });

    expect(submitted(screen)).toEqual([["sort", "series"]]);
  });

  it("submits a control outside replaceParams without normalizing it", async () => {
    url.search = "?sort=series";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["binary-package"],
      children: pageControl,
    });

    expect(submitted(screen)).toEqual([
      ["sort", "series"],
      ["page", "004"],
    ]);
  });

  it("retains submitted defaults outside replaceParams while normalizing replacements", async () => {
    url.search = "?sort=series&page=3";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: createRawSnippet(() => ({
        render: () =>
          '<div><input name="page" value="1" /><input name="view" value="all" /><input name="page-size" value="0025" /></div>',
      })),
    });

    expect(submitted(screen)).toEqual([
      ["sort", "series"],
      ["view", "all"],
      ["page-size", "0025"],
    ]);
  });

  it("applies the class names", async () => {
    url.search = "";
    const screen = await render(Form, {
      ...baseProps,
      replaceParams: ["page"],
      children: pageControl,
      class: "test-class",
    });

    expect(Array.from(formOf(screen).classList)).toEqual([
      "ds",
      "query-params-form",
      "test-class",
    ]);
  });
});

function formOf(page: RenderResult<typeof Form>): HTMLFormElement {
  return page.getByRole("form").element() as HTMLFormElement;
}

function hiddenInputs(page: RenderResult<typeof Form>): [string, string][] {
  return Array.from(
    formOf(page).querySelectorAll<HTMLInputElement>('input[type="hidden"]'),
    (input) => [input.name, input.value],
  );
}

function submitted(page: RenderResult<typeof Form>): [string, string][] {
  return Array.from(new FormData(formOf(page)), ([name, value]) => [
    name,
    String(value),
  ]);
}
