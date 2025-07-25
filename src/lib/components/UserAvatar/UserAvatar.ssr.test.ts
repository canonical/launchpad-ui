import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./UserAvatar.svelte";

describe("UserAvatar SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("renders", () => {
    it("with default icon when no user data is provided", () => {
      const { body } = render(Component);
      expect(body).toContain('<span class="ds user-avatar');
    });

    it("with image when imageUrl is provided", () => {
      const { body } = render(Component, {
        props: {
          user: {
            imageUrl: "https://example.com/avatar.png",
            name: "John Doe",
          },
        },
      });
      expect(body).toContain("<object");
      expect(body).toContain('data="https://example.com/avatar.png"');
      expect(body).toContain('title="John Doe"');
      expect(body).toContain('type="image/png"');
    });

    it("initials when name is provided but no imageUrl", () => {
      const { body } = render(Component, {
        props: {
          user: { name: "John Doe" },
        },
      });
      expect(body).toMatch(/<abbr title="John Doe"[^>]*>JD<\/abbr>/);
    });
  });

  describe("size variations", () => {
    it("applies medium size class by default", () => {
      const { body } = render(Component, {
        props: {
          user: { name: "John Doe" },
        },
      });
      expect(body).toMatch(/class="[^"]*size-medium[^"]*"/);
    });

    const sizes = ["small", "medium", "large"] as const;

    it.each(sizes)("applies %s size class", (size) => {
      const { body } = render(Component, {
        props: {
          size,
          user: { name: "John Doe" },
        },
      });
      expect(body).toMatch(new RegExp(`class="[^"]*size-${size}[^"]*"`));
      sizes.forEach((s) => {
        if (s !== size) {
          expect(body).not.toMatch(new RegExp(`class="[^"]*size-${s}[^"]*"`));
        }
      });
    });
  });
});
