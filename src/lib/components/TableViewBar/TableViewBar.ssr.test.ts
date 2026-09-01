import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./TableViewBar.svelte";

const label = "Package views";
const testId = "table-view-bar";

describe("TableViewBar SSR", () => {
  const baseProps = {
    label,
    "data-testid": testId,
    items: [
      { text: "All packages", href: "?" },
      { text: "Signed by me", href: "?view=signed-by-me" },
      { text: "My uploads", href: "?view=my-uploads" },
    ],
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLDivElement);
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList).toContain("test-class");
      expect(element.classList).toContain("ds");
      expect(element.classList).toContain("table-view-bar");
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });

  describe("tabs", () => {
    it("renders a labelled navigation with a link per item", () => {
      const page = render(Component, { props: { ...baseProps } });
      const navigation = tabsLocator(page);

      expect(navigation.getAttribute("aria-label")).toBe(label);
      expect(
        [...navigation.querySelectorAll("a")].map((link) => [
          link.textContent?.trim(),
          link.getAttribute("href"),
        ]),
      ).toEqual([
        ["All packages", "?"],
        ["Signed by me", "?view=signed-by-me"],
        ["My uploads", "?view=my-uploads"],
      ]);
    });

    it("marks only the current item as current", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          items: baseProps.items.map((item) => ({
            ...item,
            current: item.text === "Signed by me",
          })),
        },
      });
      const tabs = [...tabsLocator(page).querySelectorAll("li")];

      expect(
        tabs.map((tab) => tab.querySelector("a")?.getAttribute("aria-current")),
      ).toEqual([null, "page", null]);
      expect(tabs[1].classList).toContain("current");
    });

    it("marks only the first item claiming to be current", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          items: baseProps.items.map((item) => ({ ...item, current: true })),
        },
      });
      const tabs = [...tabsLocator(page).querySelectorAll("li")];

      expect(
        tabs.map((tab) => tab.querySelector("a")?.getAttribute("aria-current")),
      ).toEqual(["page", null, null]);
    });

    it("doesn't make the current tab sticky before hydration", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          items: baseProps.items.map((item) => ({ ...item, current: true })),
        },
      });

      for (const tab of tabsLocator(page).querySelectorAll("li")) {
        expect(tab.classList).not.toContain("sticky");
      }
    });
  });

  it("renders trailing content", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
        trailing: createRawSnippet(() => ({
          render: () => `<button type="button">Settings</button>`,
        })),
      },
    });

    expect(
      componentLocator(page).querySelector(".trailing")?.textContent,
    ).toContain("Settings");
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId(testId);
}

/** The tab navigation, as opposed to the equivalent navigation inside the trailing contextual menu. */
function tabsLocator(page: RenderResult): HTMLElement {
  return componentLocator(page).querySelector<HTMLElement>(":scope > nav")!;
}
