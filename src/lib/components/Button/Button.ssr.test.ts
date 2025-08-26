import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Button.svelte";

describe("Button SSR", () => {
  it("doesn't throw", () => {
    expect(() => {
      render(Component);
    }).not.toThrow();
  });

  describe("base properties", () => {
    it("renders with id attribute", () => {
      const { body } = render(Component, { props: { id: "test-button" } });
      expect(body).toContain('id="test-button"');
    });

    it("renders with custom class", () => {
      const { body } = render(Component, { props: { class: "custom-class" } });
      expect(body).toContain("custom-class");
    });

    it("renders with style attribute", () => {
      const { body } = render(Component, { props: { style: "color: red;" } });
      expect(body).toContain('style="color: red;"');
    });

    it("renders with type attribute", () => {
      const { body } = render(Component, { props: { type: "submit" } });
      expect(body).toContain('type="submit"');
    });

    it("renders with aria attributes", () => {
      const { body } = render(Component, {
        props: { "aria-label": "Test Button" },
      });
      expect(body).toContain('aria-label="Test Button"');
    });
  });

  describe("interactions", () => {
    it("renders as enabled by default", () => {
      const { body } = render(Component);
      expect(body).not.toContain("disabled");
    });

    it("renders disabled when props is set", () => {
      const { body } = render(Component, { props: { disabled: true } });
      expect(body).toContain("disabled");
    });

    it("renders disabled when in loading state", () => {
      const { body } = render(Component, { props: { loading: true } });
      expect(body).toContain("disabled");
    });
  });

  describe("content", () => {
    it("renders children content", () => {
      const { body } = render(Component, {
        props: {
          children: createRawSnippet(() => ({
            render: () => "<span>Click me</span>",
          })),
        },
      });
      expect(body).toContain("Click me");
    });

    it("renders iconRight when provided", () => {
      const { body } = render(Component, {
        props: {
          iconRight: createRawSnippet(() => ({
            render: () => "<span>Icon</span>",
          })),
        },
      });
      expect(body).toContain("<span>Icon</span>");
    });

    it("renders all content together", () => {
      const { body } = render(Component, {
        props: {
          children: createRawSnippet(() => ({
            render: () => "<span>Click me</span>",
          })),
          iconLeft: createRawSnippet(() => ({
            render: () => "<span class='icon-left'>Icon</span>",
          })),
          iconRight: createRawSnippet(() => ({
            render: () => "<span class='icon-right'>Icon</span>",
          })),
        },
      });
      expect(body).toContain("<span>Click me</span>");
      expect(body).toContain("<span class='icon-left'>Icon</span>");
      expect(body).toContain("<span class='icon-right'>Icon</span>");
    });

    it("renders spinner when loading", () => {
      const { body } = render(Component, { props: { loading: true } });
      expect(body).toContain("loading");
    });
  });
});
