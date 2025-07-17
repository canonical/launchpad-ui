import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Tabs.svelte";

describe("Tabs SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("base properties", () => {
    it("renders with id attribute", () => {
      const { body } = render(Component, { props: { id: "test-id" } });
      expect(body).toContain('id="test-id"');
    });

    it("renders with custom class", () => {
      const { body } = render(Component, { props: { class: "custom-class" } });
      expect(body).toContain("custom-class");
    });

    it("renders with style attribute", () => {
      const { body } = render(Component, { props: { style: "color: red;" } });
      expect(body).toContain('style="color: red;"');
    });
  });
});
