/* @canonical/generator-ds 0.10.0-experimental.3 */

import { userEvent } from "@vitest/browser/context";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";

describe("Toolbar component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Toolbar`,
    }));

    const page = render(Component, { children });
    const element = page.getByRole("toolbar");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `Toolbar`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByRole("toolbar");
    await expect.element(element).toHaveClass("test-class");
  });

  describe("interaction", () => {
    it("rotates tabindex and focus with ArrowRight and wraps to first", async () => {
      const page = render(Component, {});

      const buttons = page
        .getByRole("toolbar")
        .getByRole("button")
        .elements() as HTMLButtonElement[];

      expect(buttons.length).toBeGreaterThan(2);

      expect(buttons[0].tabIndex).toBe(0);
      for (let i = 1; i < buttons.length; i++) {
        expect(buttons[i].tabIndex).toBe(-1);
      }

      buttons[0].focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect.element(buttons[1]).toHaveFocus();
      expect(buttons[0].tabIndex).toBe(-1);
      expect(buttons[1].tabIndex).toBe(0);

      buttons[buttons.length - 1].focus();
      await userEvent.keyboard("{ArrowRight}");
      await expect.element(buttons[0]).toHaveFocus();
      expect(buttons[0].tabIndex).toBe(0);
      for (let i = 1; i < buttons.length; i++) {
        expect(buttons[i].tabIndex).toBe(-1);
      }
    });

    it("rotates tabindex and focus with ArrowLeft and wraps to last", async () => {
      const page = render(Component, {});

      const buttons = page
        .getByRole("toolbar")
        .getByRole("button")
        .elements() as HTMLButtonElement[];

      expect(buttons.length).toBeGreaterThan(2);

      buttons[0].focus();
      await userEvent.keyboard("{ArrowLeft}");
      const last = buttons[buttons.length - 1];
      await expect.element(last).toHaveFocus();
      expect(last.tabIndex).toBe(0);
      for (let i = 0; i < buttons.length - 1; i++) {
        expect(buttons[i].tabIndex).toBe(-1);
      }
    });

    it("sets tabindex on click to the clicked button", async () => {
      const page = render(Component, {});

      const buttons = page
        .getByRole("toolbar")
        .getByRole("button")
        .elements() as HTMLButtonElement[];

      expect(buttons.length).toBeGreaterThan(2);

      const target = buttons[2];
      await userEvent.click(target);

      await expect.element(target).toHaveFocus();
      for (let i = 0; i < buttons.length; i++) {
        expect(buttons[i].tabIndex).toBe(i === 2 ? 0 : -1);
      }
    });
  });
});
