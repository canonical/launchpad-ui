/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./PartialListDisclosure.svelte";
import {
  children,
  hiddenItemText,
  visibleItemText,
} from "./test.fixtures.svelte";

describe("PartialListDisclosure SSR", () => {
  const baseProps = {
    children,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(listLocator(page)).toBeDefined();
      expect(visibleItemLocator(page)).toBeDefined();
      expect(hiddenItemLocator(page)).toBeDefined();
    });
  });

  describe("attributes", () => {
    it("renders the list with an id", () => {
      const page = render(Component, { props: { ...baseProps } });
      const list = listLocator(page);
      expect(list.getAttribute("id")).toBeDefined();
    });

    it("toggle button has aria-controls matching the list id", () => {
      const page = render(Component, { props: { ...baseProps } });
      const list = listLocator(page);
      const toggleButton = page.getByRole("button");
      expect(toggleButton.getAttribute("aria-controls")).toBe(
        list.getAttribute("id"),
      );
    });

    it("toggle button has aria-expanded set to false initially", () => {
      const page = render(Component, { props: { ...baseProps } });
      const toggleButton = page.getByRole("button");
      expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    });
  });
});

function listLocator(page: RenderResult) {
  return page.getByRole("list");
}

function visibleItemLocator(page: RenderResult) {
  return page.getByText(visibleItemText);
}

function hiddenItemLocator(page: RenderResult) {
  return page.getByText(hiddenItemText);
}
