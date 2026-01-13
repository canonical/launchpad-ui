/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./CommandList.svelte";
import { children } from "./test.fixture.svelte";

describe("CommandList SSR", () => {
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
      expect(componentLocator(page)).toBeInstanceOf(
        page.window.HTMLOListElement,
      );
    });

    it("renders children", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(itemLocator(page).length).toBe(3);
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  return page.getByRole("list");
}

function itemLocator(page: RenderResult): HTMLElement[] {
  return page.getAllByRole("listitem");
}
