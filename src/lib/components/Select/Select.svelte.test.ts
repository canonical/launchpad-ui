/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import type { ComponentProps, Snippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Select.svelte";

describe("Select component", () => {
  const children = createRawSnippet(() => ({
    render: () => `<option value="1">Option 1</option>`,
  }));

  const baseProps = {
    children: children as Snippet,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeVisible();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      // Select component applies attributes to the wrapper div
      const wrapper = componentLocator(page).element().parentElement;
      expect(wrapper?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const wrapper = componentLocator(page).element().parentElement;
      expect(wrapper?.classList.contains("test-class")).toBe(true);
      expect(wrapper?.classList.contains("ds")).toBe(true);
      expect(wrapper?.classList.contains("select")).toBe(true);
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      const wrapper = componentLocator(page).element()
        .parentElement as HTMLElement;
      expect(wrapper?.style.color).toBe("orange");
    });
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Locators](https://vitest.dev/guide/browser/locators.html).
function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("combobox");
}
