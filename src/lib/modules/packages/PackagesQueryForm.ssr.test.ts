import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import Form from "./PackagesQueryForm.svelte";
import { page } from "$app/state";

vi.mock("$app/state", () => ({
  page: { url: new URL("https://launchpad.test/ubuntu/+source") },
}));

describe("PackagesQueryForm SSR", () => {
  it("preserves repeated fields, does not remove default page value", () => {
    page.url.search = "?series=one&utm=a&series=two&page=3";
    const screen = render(Form, {
      props: {
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
    page.url.search = "?binary-package=zsh&series=one&series=two";
    const screen = render(Form, {
      props: {
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
});
