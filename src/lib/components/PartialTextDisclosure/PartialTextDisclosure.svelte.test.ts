import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./PartialTextDisclosure.svelte";

const multiLineText = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6";
const singleLineText = "A single short line.";
const wrappingText =
  "The quick brown fox jumps over the lazy dog and then keeps on running across the wide open field.";
const lineHeightPx = 20;

describe("PartialTextDisclosure component", () => {
  const baseProps = {
    text: multiLineText,
    maxLines: 2,
    lineHeightPx,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(paragraphLocator(page)).toBeInTheDocument();
    await expect.element(paragraphLocator(page)).toHaveTextContent("Line 1");
  });

  describe("overflow detection", () => {
    it("shows the toggle button when the text overflows", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(page.getByRole("button", { name: "Expand visual text" }))
        .toBeInTheDocument();
    });

    it("does not show the toggle button when the text fits", async () => {
      const page = render(Component, {
        ...baseProps,
        text: singleLineText,
        maxLines: 5,
      });
      await expect.element(page.getByText(singleLineText)).toBeInTheDocument();
      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });

    it("hides the button when the paragraph grows wide enough to fit the collapsed text while expanded", async () => {
      const page = render(Component, {
        text: wrappingText,
        maxLines: 2,
        lineHeightPx,
      });
      const paragraph = page.getByText(wrappingText).element() as HTMLElement;
      const toggle = page.getByRole("button");

      // Constrain the width so the text wraps beyond `maxLines` and overflows.
      paragraph.style.width = "80px";
      await expect.element(toggle).toBeInTheDocument();

      // Expand the paragraph.
      await toggle.click();
      await expect.element(toggle).toHaveAttribute("aria-expanded", "true");

      // Grow the width so the text now fits within `maxLines` when collapsed.
      paragraph.style.width = "10000px";
      await expect.element(page.getByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("toggling", () => {
    it("expands and collapses when the button is clicked", async () => {
      const page = render(Component, { ...baseProps });
      const toggle = page.getByRole("button");

      await expect.element(toggle).toHaveAttribute("aria-expanded", "false");
      await expect.element(toggle).toHaveTextContent("Show more");
      await expect
        .element(paragraphLocator(page))
        .toHaveAttribute("data-state", "collapsed");

      await toggle.click();
      await expect.element(toggle).toHaveAttribute("aria-expanded", "true");
      await expect.element(toggle).toHaveTextContent("Show less");
      await expect
        .element(paragraphLocator(page))
        .toHaveAttribute("data-state", "expanded");

      await toggle.click();
      await expect.element(toggle).toHaveAttribute("aria-expanded", "false");
      await expect.element(toggle).toHaveTextContent("Show more");
    });

    it("associates the button with the paragraph via aria-controls", async () => {
      const page = render(Component, { ...baseProps });
      const paragraph = paragraphLocator(page).element();
      const button = page.getByRole("button").element();

      expect(paragraph.id).toBeTruthy();
      expect(button.getAttribute("aria-controls")).toBe(paragraph.id);
    });
  });

  describe("props", () => {
    it("clamps maxLines to a minimum of 1", async () => {
      const page = render(Component, { ...baseProps, maxLines: 0 });
      const paragraph = paragraphLocator(page).element() as HTMLElement;
      expect(paragraph.style.getPropertyValue("--max-lines")).toBe("1");
    });

    it("applies maxLines as a custom property", async () => {
      const page = render(Component, { ...baseProps, maxLines: 3 });
      const paragraph = paragraphLocator(page).element() as HTMLElement;
      expect(paragraph.style.getPropertyValue("--max-lines")).toBe("3");
    });

    it("applies lineHeightPx to the paragraph line height", async () => {
      const page = render(Component, { ...baseProps, lineHeightPx: 24 });
      await expect
        .element(paragraphLocator(page))
        .toHaveStyle({ lineHeight: "24px" });
    });
  });
});

function paragraphLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByText(/^Line 1/);
}
