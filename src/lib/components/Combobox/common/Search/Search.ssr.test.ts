/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Search.svelte";

describe("Search SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { label: "Search" } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { label: "Search" } });
    expect(body).toContain("<input");
    expect(body).toContain('type="search"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { label: "Search", id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { label: "Search", class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          label: "Search",
          style: "color: red;",
        },
      });
      expect(body).toMatch(/style="[^"]*color: red;[^"]*"/);
    });

    it("applies label", () => {
      const { body } = render(Component, {
        props: { label: "Search" },
      });
      expect(body).toContain('aria-label="Search"');
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const { body } = render(Component, { props: { label: "Search" } });
      expect(body).not.toContain('role="combobox"');
    });

    it("doesn't apply aria-controls", () => {
      const { body } = render(Component, { props: { label: "Search" } });
      expect(body).not.toContain("aria-controls");
    });

    it("doesn't apply aria-autocomplete", () => {
      const { body } = render(Component, { props: { label: "Search" } });
      expect(body).not.toContain("aria-autocomplete");
    });
  });
});
