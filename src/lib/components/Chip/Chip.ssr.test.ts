/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Chip.svelte";

describe("Chip SSR", () => {
  const baseProps = {
    value: "Test",
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() =>
        render(Component, { props: { ...baseProps } }),
      ).not.toThrow();
    });

    it("renders value", () => {
      const page = render(Component, {
        props: { ...baseProps, value: "Essential Content" },
      });
      expect(componentLocator(page).textContent).toContain("Essential Content");
    });

    it("renders as a span by default", () => {
      const page = render(Component, {
        props: { ...baseProps, value: "Span Chip" },
      });

      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
      expect(page.queryByRole("button")).toBeNull();
    });

    it("renders lead and value text", () => {
      const page = render(Component, {
        props: { ...baseProps, lead: "Key:", value: "Value" },
      });

      expect(page.getByText("Key:")).toBeTruthy();
      expect(page.getByText("Value")).toBeTruthy();
    });
  });

  describe("State Variants", () => {
    it("renders as a button when onclick is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, value: "Clickable", onclick: () => {} },
      });

      expect(page.getByRole("button")).toBeInstanceOf(
        page.window.HTMLButtonElement,
      );
    });

    it("renders a dismiss button when ondismiss is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, value: "Dismissible", ondismiss: () => {} },
      });

      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
      expect(page.getByRole("button", { name: "Dismiss" })).toBeInstanceOf(
        page.window.HTMLButtonElement,
      );
    });

    it("is non-interactive when readonly", () => {
      const page = render(Component, {
        props: {
          ...baseProps,
          value: "Readonly Chip",
          modifiers: { readMode: "readonly" },
        },
      });
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLSpanElement,
      );
      expect(componentLocator(page).classList.contains("readonly")).toBe(true);
      expect(page.queryByRole("button")).toBeNull();
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByTestId("chip");
}
