/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Footer.svelte";

describe("Footer SSR", () => {
  it("doesn't throw", () => {
    expect(() => render(Component)).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, {
      props: {
        children: createRawSnippet(() => ({
          render: () => "<span>Footer</span>",
        })),
      },
    });
    expect(body).toContain("<footer");
    expect(body).toContain("</footer>");
    expect(body).toContain("<span>Footer</span>");
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
