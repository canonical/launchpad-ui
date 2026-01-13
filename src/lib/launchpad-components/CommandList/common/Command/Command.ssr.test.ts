/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Command.svelte";

describe("Command SSR", () => {
  const baseProps = {
    command: "some command to run",
    href: "#line-42",
    status: null,
    "data-testid": "command",
  } satisfies ComponentProps<typeof Component> & { "data-testid": string };

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const page = render(Component, { props: { ...baseProps } });
      expect(componentLocator(page)).toBeInstanceOf(page.window.HTMLLIElement);
    });
  });

  describe("Jump link", () => {
    it("is enabled when href is provided", () => {
      const page = render(Component, {
        props: { ...baseProps, href: "#line-42" },
      });
      const jumpLink = jumpLinkLocator(page);
      expect(jumpLink).toBeInstanceOf(page.window.HTMLAnchorElement);
      expect(jumpLink.getAttribute("href")).toBe("#line-42");
    });
  });
});

function componentLocator(page: RenderResult): HTMLElement {
  // li without list parent, does not have listitem role
  return page.getByTestId("command");
}

function jumpLinkLocator(page: RenderResult): HTMLElement {
  return page.getByRole("link", { name: "Jump to command" });
}
