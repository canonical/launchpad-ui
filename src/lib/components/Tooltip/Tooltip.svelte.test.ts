/* @canonical/generator-ds 0.10.0-experimental.3 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Tooltip.svelte";
import { children, trigger } from "./fixtures.svelte";
import { ChainingManager } from "./utils/ChainingManager.js";

vi.mock("./utils/ChainingManager.js", async (importActual) => {
  const { ChainingManager: OriginalChainingManager } = await importActual<{
    ChainingManager: typeof ChainingManager;
  }>();

  class Mock extends OriginalChainingManager {
    static lastInstance: Mock | null = null;
    constructor() {
      super(350);
      Mock.lastInstance = this;
    }

    static resetChaining() {
      if (Mock.lastInstance) {
        Mock.lastInstance.chaining = false;
      }
    }
  }

  return {
    ChainingManager: Mock,
  };
});

describe("Tooltip component", () => {
  beforeEach(() => {
    (
      ChainingManager as unknown as { resetChaining: () => void }
    ).resetChaining();
  });

  const baseProps = {
    trigger,
    children,
  };

  describe("Renders", () => {
    it("trigger", async () => {
      const page = render(Component, { ...baseProps });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect.element(button).toBeInTheDocument();
    });

    it("tooltip", async () => {
      const page = render(Component, { ...baseProps });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).toBeInTheDocument();
      await expect.element(tooltip).toHaveTextContent("Tooltip content");
    });

    it("not visible by default", async () => {
      const page = render(Component, { ...baseProps });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).not.toBeVisible();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", ...baseProps });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: orange;",
        ...baseProps,
      });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).toHaveStyle("color: orange;");
    });

    it("applies classes", async () => {
      const page = render(Component, { class: "test-class", ...baseProps });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).toHaveClass("test-class");
    });
  });

  describe("Applies aria-describedby to trigger", () => {
    it("if id not provided", async () => {
      const page = render(Component, { ...baseProps });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect
        .element(button)
        .toHaveAttribute(
          "aria-describedby",
          tooltip.element().getAttribute("id"),
        );
    });

    it("if id is provided", async () => {
      const page = render(Component, { id: "test-id", ...baseProps });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect
        .element(button)
        .toHaveAttribute("aria-describedby", "test-id");
    });
  });

  describe("Is shown", () => {
    it("on trigger hover", async () => {
      const page = render(Component, { ...baseProps, delay: 0 });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      await button.hover();
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      await button.unhover();
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
    });

    it("on trigger focus", async () => {
      const page = render(Component, { ...baseProps, delay: 0 });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      (button.element() as HTMLElement).focus();
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      (button.element() as HTMLElement).blur();
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
    });

    it("if mouse moves from trigger to tooltip", async () => {
      const page = render(Component, { ...baseProps, delay: 0 });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      const tooltip = page.getByRole("tooltip", { includeHidden: true });
      await expect.element(tooltip).not.toBeVisible();
      await button.hover();
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      await tooltip.hover();
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      await tooltip.unhover();
      await expect.element(tooltip).not.toBeVisible();
    });

    it("after delay", async () => {
      vi.useFakeTimers();
      const page = render(Component, { ...baseProps, delay: 350 });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      await button.hover();
      vi.advanceTimersByTime(100);
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      vi.advanceTimersByTime(250);
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      vi.useRealTimers();
    });

    it("immediately if in chaining", async () => {
      vi.useFakeTimers();
      const page = render(Component, { ...baseProps, delay: 350 });
      const button = page.getByRole("button", { name: "Tooltip trigger" });
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      await button.hover();
      vi.advanceTimersByTime(350);
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      await button.unhover();
      await expect
        .element(page.getByRole("tooltip", { includeHidden: true }))
        .not.toBeVisible();
      vi.advanceTimersByTime(100);
      await button.hover();
      await expect.element(page.getByRole("tooltip")).toBeVisible();
      vi.useRealTimers();
    });
  });
});
