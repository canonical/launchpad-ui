import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./MulticolorIcon.svelte";

describe("MulticolorIcon SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { name: "error" } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { name: "error" } });
    expect(body).toContain("<span");
    expect(body).toContain("</span>");
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", name: "error" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;", name: "error" },
      });
      expect(body).toMatch(/style="[^"]*color: red;[^"]*"/);
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class", name: "error" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });
  });
});
