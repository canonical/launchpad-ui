import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./PackagesQueryForm.svelte";
import { page } from "$app/state";

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: { url: new SvelteURL("https://launchpad.test/ubuntu/+source") },
  };
});

describe("PackagesQueryForm component", () => {
  const pageControl = createRawSnippet(() => ({
    render: () => '<input name="page" value="004" />',
  }));

  it("submits as a GET form", async () => {
    page.url.search = "";
    const screen = await render(Component, {
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(formOf(screen.container).method).toBe("get");
    expectTypeOf<ComponentProps<typeof Component>>().not.toHaveProperty(
      "method",
    );
    expectTypeOf<ComponentProps<typeof Component>>().not.toHaveProperty(
      "onformdata",
    );
  });

  it("carries preserved params as hidden inputs", async () => {
    page.url.search = "?sort=series&page=3&utm=x";
    const screen = await render(Component, {
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(hiddenInputs(screen.container)).toEqual([
      ["sort", "series"],
      ["utm", "x"],
    ]);
  });

  it("canonicalizes the submitted params through the codecs", async () => {
    page.url.search = "?sort=series&page-size=500";
    const screen = await render(Component, {
      replaceParams: ["page", "page-size"],
      children: pageControl,
    });

    expect(submitted(screen.container)).toEqual([
      ["sort", "series"],
      ["page", "4"],
    ]);
  });

  it("preserves repeated params when the formdata event fires", async () => {
    page.url.search = "?series=one&utm=a&series=two&page=3";
    const screen = await render(Component, {
      replaceParams: ["page"],
      children: pageControl,
    });

    expect(submitted(screen.container)).toEqual([
      ["series", "one"],
      ["utm", "a"],
      ["series", "two"],
      ["page", "4"],
    ]);
  });

  it("updates preserved fields and submission behavior when the URL changes", async () => {
    page.url.search = "?sort=series&page=3";
    const screen = await render(Component, {
      replaceParams: ["page"],
      children: pageControl,
    });

    page.url.search = "?series=resolute&page=7";
    await expect
      .poll(() => hiddenInputs(screen.container))
      .toEqual([["series", "resolute"]]);
    expect(submitted(screen.container)).toEqual([
      ["series", "resolute"],
      ["page", "4"],
    ]);
  });

  it("clears a param in replaceParams when there is no input for a given parameter", async () => {
    page.url.search = "?binary-package=zsh&sort=series";
    const screen = await render(Component, {
      replaceParams: ["binary-package"],
      children: createRawSnippet(() => ({
        render: () => '<button type="submit">Submit</button>',
      })),
    });

    expect(submitted(screen.container)).toEqual([["sort", "series"]]);
  });

  it("ignores a control for a param not listed in replaceParams", async () => {
    page.url.search = "?sort=series";
    const screen = await render(Component, {
      replaceParams: ["binary-package"],
      children: pageControl,
    });

    expect(submitted(screen.container)).toEqual([["sort", "series"]]);
  });
});

function formOf(container: Element): HTMLFormElement {
  const form = container.querySelector("form");
  if (form === null) throw new Error("the component rendered no form");
  return form;
}

function hiddenInputs(container: Element): [string, string][] {
  return Array.from(
    formOf(container).querySelectorAll<HTMLInputElement>(
      'input[type="hidden"]',
    ),
    (input) => [input.name, input.value],
  );
}

function submitted(container: Element): [string, string][] {
  return Array.from(new FormData(formOf(container)), ([name, value]) => [
    name,
    String(value),
  ]);
}
