/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./TitleRow.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Title Row Content</span>",
}));

const date = createRawSnippet(() => ({
  render: () => "<span>2023-03-15</span>",
}));

describe("TitleRow SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { children, date } });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("with required props", () => {
      const { body } = render(Component, { props: { children, date } });
      expect(body).toContain("<div");
      expect(body).toContain("</div>");
      expect(body).toContain("Title Row Content");
    });

    it("with leadingText", () => {
      const { body } = render(Component, {
        props: { children, date, leadingText: "Leading Text" },
      });
      expect(body).toContain("Leading Text");
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id", children, date },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: {
          class: "test-class",
          children,
          date,
        },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          style: "color: red;",
          children,
          date,
        },
      });
      expect(body).toContain('style="color: red;"');
    });
  });
});
