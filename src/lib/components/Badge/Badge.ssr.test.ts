/* @canonical/generator-ds 0.10.0-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Badge.svelte";

describe("Badge SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { value: 42 } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { value: 42 } });
    expect(body).toContain("<span");
    expect(body).toContain("</span>");
    expect(body).toContain("42");
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", value: 42 },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { class: "test-class", value: 42 },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { style: "color: red;", value: 42 },
      });
      expect(body).toContain('style="color: red;"');
    });
  });
});
