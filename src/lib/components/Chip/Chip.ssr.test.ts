import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import Component from "./Chip.svelte";

describe("Chip SSR", () => {
  describe("Initial Rendering", () => {
    it("should render without errors when given required props", () => {
      expect(() =>
        render(Component, { props: { value: "Test" } }),
      ).not.toThrow();
    });

    it("should render essential content", () => {
      const { body } = render(Component, {
        props: { value: "Essential Content" },
      });
      expect(body).toContain("Essential Content");
    });

    it("should render as a span by default", () => {
      const { body } = render(Component, { props: { value: "Span Chip" } });
      expect(body).toContain('<span class="ds chip');
      expect(body).not.toContain("<button");
    });

    it("should render with lead text", () => {
      const { body } = render(Component, {
        props: { lead: "Key:", value: "Value" },
      });
      expect(body).toContain('<span class="lead">Key:</span>');
      expect(body).toContain('<span class="value">Value</span>');
    });
  });

  describe("State Variants", () => {
    it("should render as a button when onclick is provided", () => {
      const { body } = render(Component, {
        props: { value: "Clickable", onclick: () => {} },
      });
      expect(body).toContain('<button class="ds chip');
    });

    it("should render a dismiss button when ondismiss is provided", () => {
      const { body } = render(Component, {
        props: { value: "Dismissible", ondismiss: () => {} },
      });
      expect(body).toContain('<span class="ds chip');
      expect(body).toContain('<button class="dismiss" aria-label="Dismiss"');
    });

    it("should be non-interactive when readonly", () => {
      const { body } = render(Component, {
        props: { value: "Readonly Chip", modifiers: ["readonly"] },
      });
      expect(body).toContain('<span class="ds chip readonly');
      expect(body).not.toContain("<button");
    });
  });

  describe("Accessibility", () => {
    it("should include aria-label on dismiss button", () => {
      const { body } = render(Component, {
        props: { value: "Dismissible", ondismiss: () => {} },
      });
      expect(body).toContain('aria-label="Dismiss"');
    });
  });
});
