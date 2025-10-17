/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps, Snippet } from "svelte";
import { assert, describe, expect, it } from "vitest";
import Component from "./Popover.svelte";
import type { PopoverTriggerProps } from "./types.js";

const trigger = createRawSnippet<[PopoverTriggerProps, boolean]>(
  (triggerProps, open) => ({
    render: () =>
      `<button popovertarget="${triggerProps().popovertarget}">${open() ? "Close Popover" : "Open Popover"}</button>`,
  }),
);

const children = createRawSnippet(() => ({
  render: () => `<div>This is content of the popover.</div>`,
}));

describe("Popover SSR", () => {
  const baseProps = {
    trigger: trigger as Snippet<[PopoverTriggerProps, boolean]>,
    children: children as Snippet,
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    const body = componentLocator(page);
    expect(body).toBeTruthy();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page)?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      expect(componentLocator(page)?.classList).toContain("test-class");
      expect(componentLocator(page)?.classList).toContain("ds");
      expect(componentLocator(page)?.classList).toContain("popover");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page)?.style.color).toBe("orange");
    });
  });

  it("renders trigger", () => {
    const page = render(Component, { props: { ...baseProps } });
    const body = page.container.innerHTML;
    expect(body).toContain('<button popovertarget="');
    expect(body).toContain("Open Popover");
  });

  it("renders content", () => {
    const page = render(Component, { props: { ...baseProps } });
    const body = page.container.innerHTML;
    expect(body).toContain("<div>This is content of the popover.</div>");
  });

  it("properly links trigger with content", () => {
    const page = render(Component, { props: { ...baseProps } });
    const body = page.container.innerHTML;
    const popoverId = body.match(/id="([^"]*)"/)?.[1];
    assert(popoverId !== undefined);
    expect(body).toContain(`popovertarget="${popoverId}"`);
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(page: RenderResult): HTMLElement | null {
  return page.getByTestId("popover");
}
