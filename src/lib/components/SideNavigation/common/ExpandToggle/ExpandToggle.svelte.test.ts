/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./ExpandToggle.svelte";

describe("ExpandToggle component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(page.getByRole("button")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        id: "test-id",
      });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
      });
      await expect.element(page.getByRole("button")).toHaveStyle("color: red;");
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
      });
      await expect.element(page.getByRole("button")).toHaveClass("test-class");
    });
  });

  describe("SideNavigation snippet props", () => {
    it.each([
      ["aria-expanded", true],
      ["aria-controls", "test-id"],
      ["aria-label", "test-label"],
    ] as const)("applies %s", async (attribute, value) => {
      const page = render(Component, {
        [attribute]: value,
      });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute(attribute, String(value));
    });
  });
});
