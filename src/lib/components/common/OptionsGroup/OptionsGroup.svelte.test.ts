/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./OptionsGroup.svelte";

describe("OptionsGroup component", () => {
  const baseProps = {} satisfies ComponentProps<typeof Component>;
  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });

    it("applies class", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("options-group");
      await expect.element(element).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle("color: orange;");
    });
  });

  describe("Group title", () => {
    it("renders the group title", async () => {
      const page = render(Component, {
        ...baseProps,
        groupTitle: "Group Title",
      });
      await expect.element(page.getByText("Group Title")).toBeInTheDocument();
    });

    it("applies name to the group", async () => {
      const page = render(Component, {
        ...baseProps,
        groupTitle: "Group Name",
      });
      await expect
        .element(page.getByRole("group", { name: "Group Name" }))
        .toBeInTheDocument();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("group");
}
