/* @canonical/generator-ds 0.10.0-experimental.2 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Footer.svelte";

describe("Footer SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component);
    expect(body).toContain("<div");
    expect(body).toContain("</div>");
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;" },
      });
      expect(body).toMatch(/style="[^"]*color: red;[^"]*"/);
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });
  });
});
