/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Header.svelte";

describe("Header SSR", () => {
  it("doesn't throw", () => {
    expect(() => render(Component)).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, {
      props: {
        children: createRawSnippet(() => ({
          render: () => "<span>Header</span>",
        })),
      },
    });
    expect(body).toContain("<header");
    expect(body).toContain("</header>");
    expect(body).toContain("<span>Header</span>");
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, { props: { id: "test-id" } });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, { props: { class: "test-class" } });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, { props: { style: "color: red;" } });
      expect(body).toContain('style="color: red;"');
    });
  });
});
