/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Icon.svelte";

describe("Icon component", () => {
  const baseProps = {
    name: "edit",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    const icon = componentLocator(page);
    expect(icon).toBeDefined();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      const icon = componentLocator(page);
      expect(icon?.getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const icon = componentLocator(page);
      expect(icon?.classList.contains("test-class")).toBe(true);
      expect(icon?.classList.contains("ds")).toBe(true);
      expect(icon?.classList.contains("icon")).toBe(true);
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      const icon = componentLocator(page);
      expect(icon?.getAttribute("style")).toContain("color: orange;");
    });
  });

  it("renders icons with mask image", async () => {
    const page = render(Component, { name: "edit" });
    const icon = componentLocator(page);

    assert(icon !== null);
    expect(icon.computedStyleMap().get("mask-image")?.toString()).not.toBe(
      "none",
    );
  });

  it("renders icons with currentColor", async () => {
    const page = render(Component, {
      name: "edit",
      style: "color: blue;",
    });
    const icon = componentLocator(page);

    assert(icon !== null);
    expect(icon.computedStyleMap().get("color")?.toString()).toBe(
      "rgb(0, 0, 255)",
    );
  });
});

// Note: Prefer role/semantics-oriented ways of selecting elements (e.g., by role, label, etc.) not only for component roots but for all elements to enhance accessibility and maintainability.
// To select the component's root element, use one of the available [Queries](https://testing-library.com/docs/queries/about/#priority).
function componentLocator(
  page: RenderResult<typeof Component>,
): HTMLElement | null {
  return page.container.querySelector(".ds.icon");
}
