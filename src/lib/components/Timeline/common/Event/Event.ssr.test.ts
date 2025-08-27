/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Event.svelte";

const children = createRawSnippet(() => ({
  render: () => "Child Content",
}));

const titleRow = createRawSnippet(() => ({
  render: () => "Title Row Content",
}));

describe("Event SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("list item", () => {
      const { body } = render(Component);
      expect(body).toContain("<li");
      expect(body).toContain("</li>");
    });

    it("with children", () => {
      const { body } = render(Component, {
        props: {
          children,
        },
      });
      expect(body).toContain("Child Content");
    });

    it("with title row", () => {
      const { body } = render(Component, {
        props: {
          titleRow,
        },
      });
      expect(body).toContain("Title Row Content");
    });

    describe("Marker", () => {
      it("empty", () => {
        const { body } = render(Component);
        expect(body).toContain("marker");
        expect(body).toContain("marker-empty");
      });

      it("small", () => {
        const { body } = render(Component, {
          props: {
            markerSize: "small",
            marker: "flag",
          },
        });
        expect(body).toContain("marker-small");
      });

      it("large", () => {
        const { body } = render(Component, {
          props: {
            markerSize: "large",
            marker: "flag",
          },
        });
        expect(body).toContain("marker-large");
      });
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: {
          class: "test-class",
        },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          style: "color: red;",
        },
      });
      expect(body).toContain('style="color: red;"');
    });
  });
});
