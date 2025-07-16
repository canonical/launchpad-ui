/* @canonical/generator-ds 0.9.0-experimental.22 */
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./ThemeSetter.svelte";

describe("ThemeSetter SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { theme: "light" } });
    }).not.toThrow();
  });

  describe("adds the correct styles", () => {
    it("for light theme", () => {
      const { head } = render(Component, { props: { theme: "light" } });
      expect((head.match(/:root\s*{/g) || []).length).toBe(1);
      expect(head).not.toContain("@media (prefers-color-scheme:");
    });

    it("for dark theme", () => {
      const { head } = render(Component, { props: { theme: "dark" } });
      expect((head.match(/:root\s*{/g) || []).length).toBe(1);
      expect(head).not.toContain("@media (prefers-color-scheme:");
    });

    it("for system theme", () => {
      const { head } = render(Component, { props: { theme: "system" } });
      expect(head).toMatch(
        /@media\s*\(prefers-color-scheme:\s*light\)\s*{\s*:root\s*{/,
      );
      expect(head).toMatch(
        /@media\s*\(prefers-color-scheme:\s*dark\)\s*{\s*:root\s*{/,
      );
    });
  });

  describe("sets the correct color-scheme meta tag", () => {
    it("for light theme", () => {
      const { head } = render(Component, { props: { theme: "light" } });
      expect(head).toContain('<meta name="color-scheme" content="light"/>');
    });

    it("for dark theme", () => {
      const { head } = render(Component, { props: { theme: "dark" } });
      expect(head).toContain('<meta name="color-scheme" content="dark"/>');
    });

    it("for system theme", () => {
      const { head } = render(Component, { props: { theme: "system" } });
      expect(head).toContain(
        '<meta name="color-scheme" content="light dark"/>',
      );
    });
  });
});
