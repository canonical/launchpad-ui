/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./LinkOption.svelte";

describe("LinkOption SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { text: "Text", href: "#" } });
    }).not.toThrow();
  });

  it("renders", () => {
    const { body } = render(Component, { props: { text: "Text", href: "#" } });
    expect(body).toContain("<a");
    expect(body).toContain('href="#"');
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { text: "Text", href: "#", id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { text: "Text", href: "#", class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: { text: "Text", href: "#", style: "color: red;" },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("Disabled state", () => {
    it("is not disabled by default", () => {
      const { body } = render(Component, {
        props: { text: "Text", href: "#" },
      });
      expect(body).not.toContain('aria-disabled="true"');
      expect(body).toContain('href="#"');
    });

    it("can be disabled (removes href)", () => {
      const { body } = render(Component, {
        props: { text: "Text", href: "#", disabled: true },
      });
      // href should be removed when disabled
      expect(body).not.toContain('href="#"');
      expect(body).toContain('aria-disabled="true"');
    });
  });

  describe("Contents", () => {
    it("renders text", () => {
      const { body } = render(Component, {
        props: { text: "Main Text", href: "#" },
      });
      expect(body).toContain("Main Text");
    });

    it("renders secondary text", () => {
      const { body } = render(Component, {
        props: {
          text: "Main Text",
          href: "#",
          secondaryText: "Secondary Text",
        },
      });
      expect(body).toContain("Secondary Text");
    });

    it("renders trailing text", () => {
      const { body } = render(Component, {
        props: { text: "Main Text", href: "#", trailingText: "Trailing Text" },
      });
      expect(body).toContain("Trailing Text");
    });

    it("renders icon", () => {
      const { body } = render(Component, {
        props: {
          text: "Main Text",
          href: "#",
          icon: createRawSnippet(() => ({
            render: () => `<span class="text-icon-class"></span>`,
          })),
        },
      });
      expect(body).toContain('class="text-icon-class"');
    });
  });
});
