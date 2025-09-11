/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./RadioOption.svelte";

describe("RadioOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { text: "Option 1" } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { text: "Option 1" } });
    expect(body).toContain("<label");
    expect(body).toContain('type="radio"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { text: "Text", id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { text: "Text", class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          text: "Text",
          style: "color: red;",
        },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply inert", () => {
      const { body } = render(Component, { props: { text: "Option 1" } });
      expect(body).not.toContain("inert");
    });

    it("doesn't apply role", () => {
      const { body } = render(Component, { props: { text: "Option 1" } });
      expect(body).not.toContain('role="option"');
    });

    it("doesn't apply aria-selected", () => {
      const { body } = render(Component, { props: { text: "Option 1" } });
      expect(body).not.toMatch(/aria-selected="(false|true)"/);
    });
  });
});
