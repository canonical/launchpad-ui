/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./LinkOption.svelte";

describe("LinkOption SSR", () => {
  const baseProps = {
    text: "Text",
    href: "#",
  } satisfies ComponentProps<typeof Component>;

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(componentLocator(page)).toBeInstanceOf(
      page.window.HTMLAnchorElement,
    );
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", (attribute, value) => {
      const page = render(Component, {
        props: { ...baseProps, [attribute]: value },
      });
      const element = componentLocator(page);
      expect(element.getAttribute(attribute)).toBe(value);
    });

    it("applies class", () => {
      const page = render(Component, {
        props: { ...baseProps, class: "test-class" },
      });
      const element = componentLocator(page);
      expect(element.classList.contains("ds")).toBe(true);
      expect(element.classList.contains("link-option")).toBe(true);
      expect(element.classList.contains("test-class")).toBe(true);
    });

    it("applies style", () => {
      const page = render(Component, {
        props: { ...baseProps, style: "color: orange;" },
      });
      expect(componentLocator(page).getAttribute("style")).toBe(
        "color: orange;",
      );
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const page = render(Component, {
        props: { ...baseProps },
      });
      const element = componentLocator(page);
      expect(element.getAttribute("aria-disabled")).not.toBe("true");
      expect(element.getAttribute("href")).toBe("#");
    });

    it("can be disabled (removes href)", () => {
      const page = render(Component, {
        props: { ...baseProps, disabled: true },
      });
      const element = componentLocator(page);
      expect(element.hasAttribute("href")).toBe(false);
      expect(element.getAttribute("aria-disabled")).toBe("true");
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const page = render(Component, {
        props: { ...baseProps, text: "Main Text" },
      });
      expect(componentLocator(page).textContent).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          secondaryText: "Secondary Text",
        },
      });
      expect(componentLocator(page).textContent).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          trailingText: "Trailing Text",
        },
      });
      expect(componentLocator(page).textContent).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          icon: createRawSnippet(() => ({
            render: () => `<span data-testid="text-icon"></span>`,
          })),
        },
      });
      expect(page.getByTestId("text-icon")).toBeTruthy();
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("link");
}
