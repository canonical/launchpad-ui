import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Accordion.svelte";
import {
  itemAHeadingText,
  itemBHeadingText,
  itemCHeadingText,
  threeItems,
  twoItems,
} from "./test.fixtures.svelte";

describe("Accordion component", () => {
  const baseProps = {
    children: twoItems,
    "data-testid": "accordion-root",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect.element(page.getByText(itemAHeadingText)).toBeInTheDocument();
    await expect.element(page.getByText(itemBHeadingText)).toBeInTheDocument();
  });

  describe("exclusive mode", () => {
    it("opening one item closes the other", async () => {
      const page = render(Component, { ...baseProps, exclusive: true });

      const itemA = itemDetails(page, "item-a");
      const itemB = itemDetails(page, "item-b");

      await page.getByText(itemAHeadingText).click();
      await expect.element(itemA).toHaveAttribute("open");
      await expect.element(itemB).not.toHaveAttribute("open");

      await page.getByText(itemBHeadingText).click();
      await expect.element(itemB).toHaveAttribute("open");
      await expect.element(itemA).not.toHaveAttribute("open");
    });

    it("multi-open by default leaves siblings open", async () => {
      const page = render(Component, { ...baseProps });

      const itemA = itemDetails(page, "item-a");
      const itemB = itemDetails(page, "item-b");

      await page.getByText(itemAHeadingText).click();
      await page.getByText(itemBHeadingText).click();

      await expect.element(itemA).toHaveAttribute("open");
      await expect.element(itemB).toHaveAttribute("open");
    });
  });

  describe("keyboard navigation", () => {
    it("ArrowDown moves focus to next item, wrapping at end", async () => {
      const page = render(Component, {
        ...baseProps,
        children: threeItems,
      });
      const summaryA = summaryFor(page, "item-a");
      const summaryB = summaryFor(page, "item-b");
      const summaryC = summaryFor(page, "item-c");

      summaryA.focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(summaryA.ownerDocument.activeElement).toBe(summaryB);

      summaryC.focus();
      await userEvent.keyboard("{ArrowDown}");
      expect(summaryC.ownerDocument.activeElement).toBe(summaryA);
    });

    it("ArrowUp moves focus to previous item, wrapping at start", async () => {
      const page = render(Component, {
        ...baseProps,
        children: threeItems,
      });
      const summaryA = summaryFor(page, "item-a");
      const summaryB = summaryFor(page, "item-b");
      const summaryC = summaryFor(page, "item-c");

      summaryB.focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(summaryB.ownerDocument.activeElement).toBe(summaryA);

      summaryA.focus();
      await userEvent.keyboard("{ArrowUp}");
      expect(summaryA.ownerDocument.activeElement).toBe(summaryC);
    });

    it("Home moves focus to first item, End to last", async () => {
      const page = render(Component, {
        ...baseProps,
        children: threeItems,
      });
      const summaryA = summaryFor(page, "item-a");
      const summaryC = summaryFor(page, "item-c");

      summaryC.focus();
      await userEvent.keyboard("{Home}");
      expect(summaryC.ownerDocument.activeElement).toBe(summaryA);

      await userEvent.keyboard("{End}");
      expect(summaryA.ownerDocument.activeElement).toBe(summaryC);
    });

    it("renders three labelled items", async () => {
      const page = render(Component, {
        ...baseProps,
        children: threeItems,
      });
      await expect
        .element(page.getByText(itemCHeadingText))
        .toBeInTheDocument();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("accordion-root");
}

function itemDetails(
  page: RenderResult<typeof Component>,
  testId: string,
): Locator {
  return page.getByTestId(testId);
}

function summaryFor(
  page: RenderResult<typeof Component>,
  testId: string,
): HTMLElement {
  const details = page.getByTestId(testId).element() as HTMLDetailsElement;
  const summary = details.querySelector("summary");
  if (!summary) throw new Error(`No <summary> in #${testId}`);
  return summary;
}
