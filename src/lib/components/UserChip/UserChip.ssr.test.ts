/* @canonical/generator-ds 0.9.1-experimental.0 */

import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./UserChip.svelte";

describe("UserChip SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component, {
        props: {
          userName: "John Doe",
        },
      });
    }).not.toThrow();
  });

  describe("renders", () => {
    it("with the user's name", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
        },
      });
      expect(body).toContain("<span>John Doe</span>");
    });

    it("with avatar by default", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
        },
      });
      expect(body).toContain("user-avatar");
    });

    it("with avatar when showAvatar is explicitly true", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
          showAvatar: true,
        },
      });
      expect(body).toContain("user-avatar");
    });

    it("without avatar when showAvatar is false", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
          showAvatar: false,
        },
      });
      expect(body).not.toContain("user-avatar");
    });

    it("applies custom class", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
          class: "test-class",
        },
      });
      expect(body).toMatch(/class="[^"]*test-class[^"]*"/);
    });

    it("applies modifiers", () => {
      const { body } = render(Component, {
        props: {
          userName: "John Doe",
          modifiers: ["small"],
        },
      });
      expect(body).toMatch(/class="[^"]*small[^"]*"/);
    });
  });
});
