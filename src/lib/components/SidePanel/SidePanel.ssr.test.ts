/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { assert, describe, expect, it } from "vitest";
import Component from "./SidePanel.svelte";

describe("SidePanel SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("Renders", () => {
    it("renders as dialog", () => {
      const { body } = render(Component);
      expect(body).toContain("<dialog");
      expect(body).toContain("</dialog>");
    });

    it("renders children", () => {
      const { body } = render(Component, {
        props: {
          children: createRawSnippet(() => ({
            render: () => `<span>Child Content</span>`,
          })),
        },
      });
      expect(body).toContain("Child Content");
    });
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

  describe("Declarative controls", () => {
    it("properly links trigger with side panel", () => {
      const { body } = render(Component, {
        props: {
          trigger: createRawSnippet<[string | undefined, () => void]>(
            (popovertarget) => ({
              render: () =>
                `<button popovertarget="${popovertarget()}">Open SidePanel</button>`,
            }),
          ),
        },
      });
      const sidePanelId = body.match(/id="([^"]*)"/)?.[1];
      assert(sidePanelId !== undefined);
      expect(body).toContain(
        `<button popovertarget="${sidePanelId}">Open SidePanel</button>`,
      );
    });

    it("properly links children controls with side panel", () => {
      const { body } = render(Component, {
        props: {
          children: createRawSnippet<[string | undefined, () => void]>(
            (popovertarget) => ({
              render: () =>
                `<button popovertarget="${popovertarget()}">Close</button>`,
            }),
          ),
        },
      });
      const sidePanelId = body.match(/id="([^"]*)"/)?.[1];
      assert(sidePanelId !== undefined);
      expect(body).toContain(
        `<button popovertarget="${sidePanelId}">Close</button>`,
      );
    });
  });

  describe("Popover fallback", () => {
    it("renders as auto popover if `closeOnOutsideClick` is true", () => {
      const { body } = render(Component, {
        props: {
          closeOnOutsideClick: true,
        },
      });
      expect(body).toContain('popover="auto"');
    });

    it("renders as manual popover if `closeOnOutsideClick` is false", () => {
      const { body } = render(Component, {
        props: {
          closeOnOutsideClick: false,
        },
      });
      expect(body).toContain('popover="manual"');
    });

    it("does not have `closedby` attribute", () => {
      const { body } = render(Component);
      expect(body).not.toContain(`closedby`);
    });
  });
});
