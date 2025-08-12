/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./ButtonItem.svelte";

describe("ButtonItem SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { text: "Text" } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { text: "Text" } });
    expect(body).toContain("<button");
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
        props: { text: "Text", style: "color: red;" },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const { body } = render(Component, { props: { text: "Text" } });
      expect(body).not.toContain("disabled");
    });

    it("can be disabled", () => {
      const { body } = render(Component, {
        props: { text: "Text", disabled: true },
      });
      expect(body).toContain("disabled");
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const { body } = render(Component, { props: { text: "Main Text" } });
      expect(body).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const { body } = render(Component, {
        props: { text: "Main Text", secondaryText: "Secondary Text" },
      });
      expect(body).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const { body } = render(Component, {
        props: { text: "Main Text", trailingText: "Trailing Text" },
      });
      expect(body).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const { body } = render(Component, {
        props: {
          text: "Main Text",
          icon: createRawSnippet(() => ({
            render: () => `<span class="text-icon-class"></span>`,
          })),
        },
      });
      expect(body).toContain('class="text-icon-class"');
    });
  });
});
