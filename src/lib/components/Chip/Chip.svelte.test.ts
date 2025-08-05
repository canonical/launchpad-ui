import { page } from "@vitest/browser/context";
import type { Snippet } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Chip.svelte";

// Mock the Icon component to prevent testing its implementation details.
vi.mock("../Icon", () => ({
  Icon: (props: { name: string }) =>
    `<div data-testid="icon-${props.name}"></div>`,
}));

describe("Chip", () => {
  describe("Initial Rendering", () => {
    it("should render with default props as a non-interactive element", async () => {
      render(Component, { value: "Default Chip" });

      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });

    it("should render with a lead element", async () => {
      render(Component, { lead: "Key", value: "Value" });

      await expect.element(page.getByText("Key")).toBeInTheDocument();
      await expect.element(page.getByText("Value")).toBeInTheDocument();
    });

    it("should render with an icon", async () => {
      const icon: Snippet = createRawSnippet(() => ({
        render: () => `<div data-testid="custom-icon"></div>`,
      }));
      render(Component, { value: "Icon Chip", icon });

      await expect.element(page.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("should apply custom class and modifiers", async () => {
      render(Component, {
        value: "Styled Chip",
        class: "extra-class",
        modifiers: ["dense", "caution"],
      });

      const element = page.getByTestId("chip");

      await expect.element(element).toHaveClass("extra-class");
      await expect.element(element).toHaveClass("dense");
      await expect.element(element).toHaveClass("caution");
    });

    it("should apply the id attribute", async () => {
      render(Component, { value: "ID Chip", id: "my-chip-id" });

      await expect.element(page.getByTestId("chip")).toHaveAttribute("id", "my-chip-id");
    });
    it("should not render a button when dismiss is provided", async () => {
      render(Component, { value: "Dismissible", ondismiss: () => { } });

      await expect.element(page.getByTestId("chip")).not.toHaveAttribute("type", "button");
      await expect.element(page.getByRole("button")).toHaveAccessibleName("Dismiss");
    });

    it("should not render a button when readonly is provided", async () => {
      render(Component, { value: "Readonly", modifiers: ["readonly"], onclick: () => { } });

      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("Interactions & States", () => {
    it("should render a working button when onclick is provided", async () => {
      const onclick = vi.fn();
      render(Component, { value: "Clickable", onclick });

      const element = page.getByRole("button");
      await expect.element(element).toBeInTheDocument();
      await element.click();
      expect(onclick).toHaveBeenCalled();
    });

    it("should render a working dismiss button when ondismiss is provided", async () => {
      const ondismiss = vi.fn();
      render(Component, { value: "Dismissible", ondismiss });

      const dissmissButton = page.getByLabelText("Dismiss");
      await expect.element(dissmissButton).toBeInTheDocument();

      await expect.element(dissmissButton).toBeInTheDocument();
      await dissmissButton.click();
      expect(ondismiss).toHaveBeenCalled();
    });
  });
});
