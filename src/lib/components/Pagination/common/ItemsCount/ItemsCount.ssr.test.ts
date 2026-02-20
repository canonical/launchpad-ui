import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./ItemsCount.svelte";

describe("ItemsCount SSR", () => {
  const baseProps = {
    showing: 5,
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders text", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLSpanElement);
    expect(componentLocator(page).textContent).toContain("Showing 5 items");
  });

  describe("text generation", () => {
    it("renders singular text without total", () => {
      const page = render(Component, { props: { showing: 1 } });
      expect(componentLocator(page).textContent).toContain("Showing 1 item");
    });

    it("renders plural text without total", () => {
      const page = render(Component, { props: { showing: 2 } });
      expect(componentLocator(page).textContent).toContain("Showing 2 items");
    });

    it("renders singular text with a singular total", () => {
      const page = render(Component, { props: { showing: 1, total: 1 } });
      expect(componentLocator(page).textContent).toContain(
        "Showing 1 of 1 item",
      );
    });

    it("renders pluralized total text", () => {
      const page = render(Component, { props: { showing: 1, total: 2 } });
      expect(componentLocator(page).textContent).toContain(
        "Showing 1 of 2 items",
      );
    });

    it("treats total=0 as not provided when showing is not zero", () => {
      const page = render(Component, { props: { showing: 4, total: 0 } });
      expect(componentLocator(page).textContent).toContain("Showing 4 items");
    });

    it("treats total=0 as zero when showing is also zero", () => {
      const page = render(Component, { props: { showing: 0, total: 0 } });
      expect(componentLocator(page).textContent).toContain(
        "Showing 0 of 0 items",
      );
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "Items count"],
    ])("applies %s", (attribute, expected) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: expected },
      });
      expect(componentLocator(page).getAttribute(attribute)).toBe(expected);
    });

    it("applies classes", () => {
      const page = render(Component, {
        props: { class: "test-class", ...baseProps },
      });
      expect(componentLocator(page).classList).toContain("test-class");
      expect(componentLocator(page).classList).toContain("ds");
      expect(componentLocator(page).classList).toContain(
        "pagination-items-count",
      );
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { style: "color: orange;", ...baseProps },
      });
      expect(componentLocator(page).style.color).toBe("orange");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByText(/^Showing /);
}
