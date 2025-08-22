/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { assert, describe, expect, it } from "vitest";
import Component from "./Modal.svelte";

describe("Modal SSR", () => {
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

    it("renders with close button by default", () => {
      const { body } = render(Component);
      expect(body).toContain(`aria-label="Close"`);
    });

    it.each(["header", "children", "footer"])(
      "renders with %s when provided",
      (slot) => {
        const slotContent = `<span>${slot} Content</span>`;

        const { body } = render(Component, {
          props: {
            [slot]: createRawSnippet(() => ({
              render: () => slotContent,
            })),
          },
        });

        expect(body).toContain(slotContent);
      },
    );
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
    it("properly links trigger with modal", () => {
      const { body } = render(Component, {
        props: {
          trigger: createRawSnippet<[string | undefined, () => void]>(
            (popovertarget) => ({
              render: () =>
                `<button popovertarget="${popovertarget()}">Open Modal</button>`,
            }),
          ),
        },
      });
      const modalId = body.match(/id="([^"]*)"/)?.[1];
      assert(modalId !== undefined);
      expect(body).toContain(
        `<button popovertarget="${modalId}">Open Modal</button>`,
      );
    });

    it("properly links footer controls with modal", () => {
      const { body } = render(Component, {
        props: {
          footer: createRawSnippet<[string | undefined, () => void]>(
            (popovertarget) => ({
              render: () =>
                `<button popovertarget="${popovertarget()}">Close</button>`,
            }),
          ),
        },
      });
      const modalId = body.match(/id="([^"]*)"/)?.[1];
      assert(modalId !== undefined);
      expect(body).toContain(
        `<button popovertarget="${modalId}">Close</button>`,
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
