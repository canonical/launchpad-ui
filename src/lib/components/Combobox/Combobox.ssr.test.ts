/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Combobox.svelte";

const requiredProps = {
  search: createRawSnippet(() => ({
    render: () => `<input type="search" />`,
  })),
  inputsName: "options",
};

describe("Combobox SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: requiredProps });
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("search", () => {
      const { body } = render(Component, { props: requiredProps });
      expect(body).toContain('<input type="search" />');
    });

    it("children", () => {
      const { body } = render(Component, {
        props: {
          ...requiredProps,
          children: createRawSnippet(() => ({
            render: () => "<div>Option 1</div>",
          })),
        },
      });
      expect(body).toContain("Option 1");
    });

    it("footer", () => {
      const { body } = render(Component, {
        props: {
          ...requiredProps,
          footer: createRawSnippet(() => ({
            render: () => "<div>Footer content</div>",
          })),
        },
      });
      expect(body).toContain("Footer content");
    });

    it("helper", () => {
      const { body } = render(Component, {
        props: {
          ...requiredProps,
          helper: createRawSnippet(() => ({
            render: () => "<div>Helper content</div>",
          })),
        },
      });
      expect(body).toContain("Helper content");
    });
  });

  describe("Basic attributes", () => {
    it("applies id", () => {
      const { body } = render(Component, {
        props: { ...requiredProps, id: "test-id" },
      });
      expect(body).toContain('id="test-id"');
    });

    it("applies class", () => {
      const { body } = render(Component, {
        props: { ...requiredProps, class: "test-class" },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies style", () => {
      const { body } = render(Component, {
        props: {
          ...requiredProps,
          style: "color: red;",
        },
      });
      expect(body).toContain('style="color: red;"');
    });
  });

  describe("After-mount attributes", () => {
    it("doesn't apply role", () => {
      const { body } = render(Component, { props: requiredProps });
      expect(body).not.toContain('role="listbox"');
    });

    it("doesn't apply aria-multiselectable", () => {
      const { body } = render(Component, { props: requiredProps });
      expect(body).not.toContain("aria-multiselectable");
    });

    it("doesn't apply aria-busy", () => {
      const { body } = render(Component, {
        props: { ...requiredProps, "aria-busy": true },
      });
      expect(body).not.toContain('aria-busy="true"');
    });
  });
});
