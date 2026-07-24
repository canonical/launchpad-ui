import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./PartialTextDisclosure.svelte";

const text = "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6";

describe("PartialTextDisclosure SSR", () => {
  const baseProps = {
    text,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders the text in a paragraph", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLParagraphElement,
      );
      expect(componentLocator(page).textContent).toContain("Line 1");
    });

    it("renders in the collapsed state", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).getAttribute("data-state")).toBe(
        "collapsed",
      );
    });

    it("does not render the toggle button (overflow is detected client-side)", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(page.container.querySelector("button")).toBeNull();
    });
  });

  describe("props", () => {
    it("applies the default maxLines custom property", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).style.getPropertyValue("--max-lines")).toBe(
        "5",
      );
    });

    it("clamps maxLines to a minimum of 1", () => {
      const page = render(Component, { props: { ...baseProps, maxLines: 0 } });
      expect(componentLocator(page).style.getPropertyValue("--max-lines")).toBe(
        "1",
      );
    });

    it("applies maxLines as a custom property", () => {
      const page = render(Component, { props: { ...baseProps, maxLines: 3 } });
      expect(componentLocator(page).style.getPropertyValue("--max-lines")).toBe(
        "3",
      );
    });

    it("applies lineHeightPx to the paragraph line height", () => {
      const page = render(Component, {
        props: { ...baseProps, lineHeightPx: 24 },
      });
      expect(componentLocator(page).style.lineHeight).toBe("24px");
    });

    it("omits the line height when lineHeightPx is not provided", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page).style.lineHeight).toBe("");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByText(/^Line 1/);
}
