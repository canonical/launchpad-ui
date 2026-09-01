import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./TableViewBar.svelte";

const label = "Package views";
const testId = "table-view-bar";

describe("TableViewBar component", () => {
  const baseProps = {
    label,
    "data-testid": testId,
    items: [
      { text: "All packages", href: "?" },
      { text: "Signed by me", href: "?view=signed-by-me" },
      { text: "My uploads", href: "?view=my-uploads" },
    ],
  } satisfies ComponentProps<typeof Component>;

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect
        .element(componentLocator(page))
        .toHaveClass("table-view-bar");
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("tabs", () => {
    it("renders a labelled navigation with a link per item, in order", async () => {
      const page = render(Component, { ...baseProps });
      const links = tabsLocator(page).getByRole("link");

      await expect.element(tabsLocator(page)).toBeVisible();
      for (const [index, { text, href }] of baseProps.items.entries()) {
        await expect.element(links.nth(index)).toHaveTextContent(text);
        await expect.element(links.nth(index)).toHaveAttribute("href", href);
      }
    });

    it("marks only the current item as current", async () => {
      const page = render(Component, {
        ...baseProps,
        items: baseProps.items.map((item) => ({
          ...item,
          current: item.text === "Signed by me",
        })),
      });
      const navigation = tabsLocator(page);

      await expect
        .element(navigation.getByRole("link", { name: "Signed by me" }))
        .toHaveAttribute("aria-current", "page");
      await expect
        .element(navigation.getByRole("link", { name: "All packages" }))
        .not.toHaveAttribute("aria-current");
    });

    it("marks only the first item claiming to be current", async () => {
      const page = render(Component, {
        ...baseProps,
        items: baseProps.items.map((item) => ({ ...item, current: true })),
      });
      const navigation = tabsLocator(page);

      await expect
        .element(navigation.getByRole("link", { name: "All packages" }))
        .toHaveAttribute("aria-current", "page");
      await expect
        .element(navigation.getByRole("link", { name: "Signed by me" }))
        .not.toHaveAttribute("aria-current");
    });

    it("renders items sharing an href when they have distinct keys", async () => {
      const page = render(Component, {
        ...baseProps,
        items: [
          { text: "First", href: "?", key: "first" },
          { text: "Second", href: "?", key: "second" },
        ],
      });
      const navigation = tabsLocator(page);

      await expect
        .element(navigation.getByRole("link", { name: "First" }))
        .toBeVisible();
      await expect
        .element(navigation.getByRole("link", { name: "Second" }))
        .toBeVisible();
    });
  });

  it("renders trailing content", async () => {
    const page = render(Component, {
      ...baseProps,
      trailing: createRawSnippet(() => ({
        render: () => `<button type="button">Settings</button>`,
      })),
    });

    await expect
      .element(page.getByRole("button", { name: "Settings" }))
      .toBeVisible();
  });

  describe("overflow menu", () => {
    it("lists every item, marking the current one, once opened", async () => {
      const page = render(Component, {
        ...baseProps,
        items: baseProps.items.map((item) => ({
          ...item,
          current: item.text === "Signed by me",
        })),
      });

      await menuTriggerLocator(page).click();
      const menu = menuLocator(page);

      const links = menu.getByRole("link");
      for (const [index, { text }] of baseProps.items.entries()) {
        await expect.element(links.nth(index)).toHaveTextContent(text);
      }
      await expect
        .element(menu.getByRole("link", { name: "Signed by me" }))
        .toHaveAttribute("aria-current", "page");
    });

    it("runs the item's onclick and closes when an item is activated", async () => {
      const onclick = vi.fn((event: Event) => event.preventDefault());
      const page = render(Component, {
        ...baseProps,
        items: baseProps.items.map((item) => ({ ...item, onclick })),
      });

      await menuTriggerLocator(page).click();
      await menuLocator(page).getByRole("link", { name: "My uploads" }).click();

      expect(onclick).toHaveBeenCalledTimes(1);
      await expect.element(menuLocator(page)).not.toBeVisible();
    });
  });

  describe("scrolling a focused tab into view", () => {
    // Wide enough for a couple of tabs, too narrow for all of them.
    const narrowBar = { style: "inline-size: 15rem;" };

    it("scrolls an out-of-view tab into view when it receives focus", async () => {
      const page = render(Component, { ...manyItemsProps(), ...narrowBar });
      const bar = componentElement(page);
      const lastTab = tabElement(page, "Latest uploads");

      expect(bar.scrollLeft).toBe(0);
      expect(isWithin(lastTab, bar)).toBe(false);

      lastTab.focus({ preventScroll: true });

      await expect.poll(() => isWithin(lastTab, bar)).toBe(true);
    });

    it("doesn't scroll when a focused tab is already in view", async () => {
      const page = render(Component, { ...manyItemsProps(), ...narrowBar });
      const bar = componentElement(page);
      const firstTab = tabElement(page, "All packages");

      firstTab.focus({ preventScroll: true });

      await expect.poll(() => bar.scrollLeft).toBe(0);
    });

    it("doesn't scroll the page vertically when a tab receives focus", async () => {
      const page = render(Component, {
        ...manyItemsProps(),
        // Placed within a scrollable page, but fully in view vertically.
        style: `${narrowBar.style} margin-block: 50vh 200vh;`,
      });
      const bar = componentElement(page);
      const lastTab = tabElement(page, "Latest uploads");

      lastTab.focus({ preventScroll: true });

      await expect.poll(() => isWithin(lastTab, bar)).toBe(true);
      expect(document.scrollingElement?.scrollTop).toBe(0);
    });

    it("doesn't leave the focused tab under the sticky current tab", async () => {
      const page = render(Component, {
        ...manyItemsProps("All packages"),
        ...narrowBar,
      });
      const currentTab = tabElement(page, "All packages");
      const laterTab = tabElement(page, "Signed by me");

      // Scroll to the end, which leaves the later tab behind the sticky current tab.
      tabElement(page, "Latest uploads").focus({ preventScroll: true });
      await expect
        .poll(() => laterTab.getBoundingClientRect().right)
        .toBeLessThanOrEqual(currentTab.getBoundingClientRect().right);

      laterTab.focus({ preventScroll: true });

      await expect
        .poll(
          () =>
            currentTab.getBoundingClientRect().right -
            laterTab.getBoundingClientRect().left,
        )
        .toBeLessThanOrEqual(SUBPIXEL_TOLERANCE);
    });

    it("doesn't leave the focused tab under the trailing content", async () => {
      const page = render(Component, { ...manyItemsProps(), ...narrowBar });
      const trailing = trailingElement(page);
      const middleTab = tabElement(page, "My uploads");

      middleTab.focus({ preventScroll: true });

      await expect
        .poll(
          () =>
            middleTab.getBoundingClientRect().right -
            trailing.getBoundingClientRect().left,
        )
        .toBeLessThanOrEqual(SUBPIXEL_TOLERANCE);
    });
  });
});

function manyItemsProps(current?: string): ComponentProps<typeof Component> {
  return {
    label,
    "data-testid": testId,
    items: [
      { text: "All packages", href: "?" },
      { text: "Signed by me", href: "?view=signed-by-me" },
      { text: "Maintained by me", href: "?view=maintained-by-me" },
      { text: "My uploads", href: "?view=my-uploads" },
      { text: "Latest uploads", href: "?view=latest-uploads" },
    ].map((item) => ({ ...item, current: item.text === current })),
  };
}

/** Tabs overlap each other by half a pixel by design and scroll offsets get rounded, so position comparisons allow a pixel of slack. */
const SUBPIXEL_TOLERANCE = 1;

/** Whether `element` is fully within the visible area of the scrollable `container`. */
function isWithin(element: Element, container: Element): boolean {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return (
    elementRect.left >= containerRect.left - SUBPIXEL_TOLERANCE &&
    elementRect.right <= containerRect.right + SUBPIXEL_TOLERANCE
  );
}

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId(testId);
}

function componentElement(page: RenderResult<typeof Component>): HTMLElement {
  return componentLocator(page).element() as HTMLElement;
}

function tabsLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("navigation", { name: label });
}

function menuTriggerLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("button", { name: `${label} menu` });
}

function menuLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("options-panel");
}

function tabElement(
  page: RenderResult<typeof Component>,
  name: string,
): HTMLElement {
  return tabsLocator(page).getByRole("link", { name }).element() as HTMLElement;
}

function trailingElement(page: RenderResult<typeof Component>): HTMLElement {
  return componentElement(page).querySelector(".trailing") as HTMLElement;
}
