/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./ButtonOption.svelte";

describe("ButtonOption component", () => {
  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, { text: "Button Option" });
      const element = page.getByRole("button");
      await expect.element(element).toBeInTheDocument();
      await expect.element(page.getByText("Button Option")).toBeVisible();
    });

    it("renders secondary text", async () => {
      const page = render(Component, {
        text: "Option",
        secondaryText: "Secondary",
      });
      await expect.element(page.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders trailing text", async () => {
      const page = render(Component, {
        text: "Option",
        trailingText: "Trailing",
      });
      await expect.element(page.getByText("Trailing")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const icon = "<span data-testid='icon'>Icon</span>";
      const page = render(Component, {
        text: "Option",
        icon: createRawSnippet(() => ({ render: () => icon })),
      });
      await expect.element(page.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { text: "Option", id: "test-id" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { text: "Option", class: "test-class" });
      await expect.element(page.getByRole("button")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        text: "Option",
        style: "color: red;",
      });
      await expect.element(page.getByRole("button")).toHaveStyle("color: red;");
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", async () => {
      const page = render(Component, { text: "Button Option" });
      await expect.element(page.getByRole("button")).not.toBeDisabled();
    });

    it("can be disabled", async () => {
      const page = render(Component, { text: "Button Option", disabled: true });
      await expect.element(page.getByRole("button")).toBeDisabled();
    });
  });

  it("fires click handler", async () => {
    const onclick = vi.fn();
    const page = render(Component, { text: "Button Option", onclick });
    await page.getByRole("button").click();
    expect(onclick).toHaveBeenCalled();
  });

  describe("type attribute", () => {
    it("is of type button by default", async () => {
      const page = render(Component, { text: "Button Option" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("type", "button");
    });

    it("can be of other type", async () => {
      const page = render(Component, { text: "Button Option", type: "submit" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("type", "submit");
    });
  });
});
