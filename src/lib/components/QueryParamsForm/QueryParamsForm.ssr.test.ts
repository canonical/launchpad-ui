import { strCodec, superhref } from "@canonical/superhref";
import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { Component } from "svelte";
import { describe, expect, it } from "vitest";
import { paginationCodecs } from "$lib/codecs/paginationCodecs.js";
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

describe("QueryParamsForm SSR", () => {
  it("preserves repeated fields, does not remove default page value", () => {
    const screen = render(Form, {
      props: {
        schema,
        url: new URL(
          "https://launchpad.test/ubuntu/+source?series=one&utm=a&series=two&page=3",
        ),
        replaceParams: ["page"],
        children: createRawSnippet(() => ({
          render: () => '<input name="page" value="1" />',
        })),
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");

    expect(form.method).toBe("get");
    expect(Array.from(new screen.window.FormData(form))).toEqual([
      ["series", "one"],
      ["utm", "a"],
      ["series", "two"],
      ["page", "1"],
    ]);
  });

  it("clears the parameter form is meant to update if it has no input", () => {
    const screen = render(Form, {
      props: {
        schema,
        url: new URL(
          "https://launchpad.test/ubuntu/+source?binary-package=zsh&series=one&series=two",
        ),
        replaceParams: ["binary-package"],
        children: createRawSnippet(() => ({
          render: () => '<button type="submit">Submit</button>',
        })),
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");

    expect(Array.from(new screen.window.FormData(form))).toEqual([
      ["series", "one"],
      ["series", "two"],
    ]);
  });

  it("submits controls outside replaceParams alongside preserved empty and repeated values", () => {
    const screen = render(Form, {
      props: {
        schema,
        url: new URL(
          "https://launchpad.test/ubuntu/+source?series=&series=two&page=3",
        ),
        replaceParams: ["page"],
        children: createRawSnippet(() => ({
          render: () =>
            '<div><input name="page" value="004" /><input name="series" value="changed" /></div>',
        })),
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");

    expect(Array.from(new screen.window.FormData(form))).toEqual([
      ["series", ""],
      ["series", "two"],
      ["page", "004"],
      ["series", "changed"],
    ]);
  });

  it("applies the class names", () => {
    const screen = render(Form, {
      props: {
        schema,
        url: new URL("https://launchpad.test/ubuntu/+source"),
        replaceParams: ["page"],
        class: "test-class",
        children: createRawSnippet(() => ({
          render: () => '<button type="submit">Submit</button>',
        })),
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");

    expect(Array.from(form.classList)).toEqual([
      "ds",
      "query-params-form",
      "test-class",
    ]);
  });

  it("renders only the preserved params without children", () => {
    const screen = render(Form, {
      props: {
        schema,
        url: new URL(
          "https://launchpad.test/ubuntu/+source?page=3&sort=series",
        ),
        replaceParams: ["page"],
      },
    });
    const form = screen.document.querySelector("form");
    if (form === null) throw new Error("The component rendered no form");

    expect(form.children).toHaveLength(1);
    expect(Array.from(new screen.window.FormData(form))).toEqual([
      ["sort", "series"],
    ]);
  });
});
