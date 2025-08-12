/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./ButtonItem.svelte";

describe("ButtonItem component", () => {
  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, { text: "Button Item" });
      const element = page.getByRole("button");
      await expect.element(element).toBeInTheDocument();
      await expect.element(page.getByText("Button Item")).toBeVisible();
    });

    it("renders secondary text", async () => {
      const page = render(Component, {
        text: "Item",
        secondaryText: "Secondary",
      });
      await expect.element(page.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders trailing text", async () => {
      const page = render(Component, {
        text: "Item",
        trailingText: "Trailing",
      });
      await expect.element(page.getByText("Trailing")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const icon = "<span data-testid='icon'>Icon</span>";
      const page = render(Component, {
        text: "Item",
        icon: createRawSnippet(() => ({ render: () => icon })),
      });
      await expect.element(page.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { text: "Item", id: "test-id" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { text: "Item", class: "test-class" });
      await expect.element(page.getByRole("button")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        text: "Item",
        style: "color: red;",
      });
      await expect.element(page.getByRole("button")).toHaveStyle("color: red;");
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", async () => {
      const page = render(Component, { text: "Button Item" });
      await expect.element(page.getByRole("button")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { text: "Button Item", disabled: true });
      await expect.element(page.getByRole("button")).toBeDisabled();
    });
  });

  it("fires click handler", async () => {
    const onclick = vi.fn();
    const page = render(Component, { text: "Button Item", onclick });
    await page.getByRole("button").click();
    expect(onclick).toHaveBeenCalled();
  });

  describe("type attribute", () => {
    it("is of type button by default", async () => {
      const page = render(Component, { text: "Button Item" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("type", "button");
    });

    it("can be of other type", async () => {
      const page = render(Component, { text: "Button Item", type: "submit" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("type", "submit");
    });
  });
});
