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

  describe("adds the correct stylesheet", () => {
    it("for light theme", () => {
      const { head } = render(Component, { props: { theme: "light" } });
      expect(head).toContain(
        '<link rel="stylesheet" href="/styles/colors/light.css"/>',
      );
      expect(head).not.toContain("dark.css");
      expect(head).not.toContain("system.css");
    });

    it("for dark theme", () => {
      const { head } = render(Component, { props: { theme: "dark" } });
      expect(head).toContain(
        '<link rel="stylesheet" href="/styles/colors/dark.css"/>',
      );
      expect(head).not.toContain("light.css");
      expect(head).not.toContain("system.css");
    });

    it("for system theme", () => {
      const { head } = render(Component, { props: { theme: "system" } });
      expect(head).toContain(
        '<link rel="stylesheet" href="/styles/colors/system.css"/>',
      );
      expect(head).not.toContain("light.css");
      expect(head).not.toContain("dark.css");
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
