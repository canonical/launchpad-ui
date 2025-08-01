import { page } from "@vitest/browser/context";
import type { Snippet } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Chip.svelte";

// Mock the Icon component to prevent testing its implementation details.
vi.mock("../Icon", () => ({
  Icon: (props: { name: string }) =>
    `<div data-testid="icon-${props.name}"></div>`,
}));

describe("Chip", () => {
  describe("Initial Rendering", () => {
    test("should render with default props as a non-interactive element", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, { value: "Default Chip" });

      expect(element?.tagName).not.toEqual("BUTTON");
    });

    test("should render with a lead element", async () => {
      render(Component, { lead: "Key", value: "Value" });

      await expect.element(page.getByText("Key")).toBeInTheDocument();
      await expect.element(page.getByText("Value")).toBeInTheDocument();
    });

    test("should render with an icon", async () => {
      const icon: Snippet = createRawSnippet(() => ({
        render: () => `<div data-testid="custom-icon"></div>`,
      }));
      render(Component, { value: "Icon Chip", icon });

      await expect.element(page.getByTestId("custom-icon")).toBeInTheDocument();
    });

    test("should apply custom class and modifiers", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, {
        value: "Styled Chip",
        class: "extra-class",
        modifiers: ["dense", "caution"],
      });

      await expect.element(element).toHaveClass("extra-class");
      await expect.element(element).toHaveClass("dense");
      await expect.element(element).toHaveClass("caution");
    });

    test("should apply the id attribute", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, { value: "ID Chip", id: "my-chip-id" });

      expect(element?.id).toBe("my-chip-id");
    });
  });

  describe("Interactions & States", () => {
    test("should render as a button when onclick is provided", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, { value: "Clickable", onclick: () => {} });

      expect(element?.tagName).toBe("BUTTON");
    });

    test("should render a dismiss button when ondismiss is provided", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, { value: "Dismissible", ondismiss: () => {} });

      const dissmissButton = page.getByLabelText("Dismiss");
      await expect.element(dissmissButton).toBeInTheDocument();

      expect(element?.tagName).not.toEqual("BUTTON");
      expect(dissmissButton.element().tagName).toBe("BUTTON");
    });
  });

  describe("Edge Cases", () => {
    test("should be non-interactive when readonly modifier is present", async () => {
      const {
        container: { firstElementChild: element },
      } = render(Component, {
        value: "Readonly Chip",
        modifiers: ["readonly"],
      });

      expect(element?.tagName).not.toEqual("BUTTON");
      expect(element?.classList).toContain("readonly");
    });
  });

  describe("Accessibility", () => {
    test("should have proper ARIA role for a clickable chip", async () => {
      render(Component, { value: "ARIA Button", onclick: () => {} });
      const button = page.getByRole("button", { name: "ARIA Button" });
      await expect.element(button).toBeInTheDocument();
    });

    test("should have a proper accessible name for the dismiss button", async () => {
      render(Component, { value: "Dismissible", ondismiss: () => {} });
      const dismissButton = page.getByRole("button", { name: "Dismiss" });
      await expect.element(dismissButton).toBeInTheDocument();
    });
  });
});
