/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./ThemeSetter.svelte";

const baseProps = {
  theme: "light" as const,
} satisfies ComponentProps<typeof Component>;

describe("ThemeSetter SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  describe("adds the correct styles", () => {
    it("for light theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "light" },
      });
      expect((page.head.match(/:root\s*{/g) || []).length).toBe(1);
      expect(page.head).not.toContain("@media (prefers-color-scheme:");
    });

    it("for dark theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "dark" },
      });
      expect((page.head.match(/:root\s*{/g) || []).length).toBe(1);
      expect(page.head).not.toContain("@media (prefers-color-scheme:");
    });

    it("for system theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "system" },
      });
      expect(page.head).toMatch(
        /@media\s*\(prefers-color-scheme:\s*light\)\s*{\s*:root\s*{/,
      );
      expect(page.head).toMatch(
        /@media\s*\(prefers-color-scheme:\s*dark\)\s*{\s*:root\s*{/,
      );
    });
  });

  describe("sets the correct color-scheme meta tag", () => {
    it("for light theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "light" },
      });
      expect(page.head).toContain(
        '<meta name="color-scheme" content="light"/>',
      );
    });

    it("for dark theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "dark" },
      });
      expect(page.head).toContain('<meta name="color-scheme" content="dark"/>');
    });

    it("for system theme", () => {
      const page = render(Component, {
        props: { ...baseProps, theme: "system" },
      });
      expect(page.head).toContain(
        '<meta name="color-scheme" content="light dark"/>',
      );
    });
  });
});
