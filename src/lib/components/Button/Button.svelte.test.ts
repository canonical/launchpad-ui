import { createRawSnippet } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Button.svelte";

describe("Button", () => {
  it("renders", async () => {
    const page = render(Component);
    const element = page.getByRole("button");
    await expect.element(element).toBeInTheDocument();
  });

  describe("base properties", () => {
    it("applies id", async () => {
      const page = render(Component, {
        props: { id: "test-button" },
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveAttribute("id", "test-button");
    });

    it("applies class", async () => {
      const page = render(Component, {
        props: { class: "custom-class" },
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveClass("custom-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        props: { style: "color: red;" },
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveStyle("color: red;");
    });

    it("applies type", async () => {
      const page = render(Component, {
        props: { type: "submit" },
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveAttribute("type", "submit");
    });

    it("applies aria-attributes", async () => {
      const page = render(Component, {
        props: { "aria-label": "Test Button" },
      });
      const element = page.getByRole("button");
      await expect
        .element(element)
        .toHaveAttribute("aria-label", "Test Button");
    });
  });

  describe("interactions", () => {
    it("is enabled by default", async () => {
      const page = render(Component);
      const element = page.getByRole("button");
      await expect.element(element).toBeEnabled();
    });

    it("emits click event when clicked", async () => {
      const onclick = vi.fn();
      const page = render(Component, {
        onclick,
      });
      const element = page.getByRole("button");
      await element.click();
      expect(onclick).toHaveBeenCalledOnce();
    });

    it("is disabled when prop is set", async () => {
      const page = render(Component, { disabled: true });
      const element = page.getByRole("button");
      await expect.element(element).toBeDisabled();
    });

    it("is disabled when in loading state", async () => {
      const page = render(Component, { loading: true });
      const element = page.getByRole("button");
      await expect.element(element).toBeDisabled();
    });
  });

  describe("content", () => {
    it("renders children content", async () => {
      const page = render(Component, {
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveTextContent("Click me");
    });

    it("renders iconLeft when provided", async () => {
      const page = render(Component, {
        iconLeft: createRawSnippet(() => ({
          render: () => "<span>Icon</span>",
        })),
      });
      const element = page.getByRole("button");
      await expect.element(element).toContainHTML("<span>Icon</span>");
    });

    it("renders iconRight when provided", async () => {
      const page = render(Component, {
        iconRight: createRawSnippet(() => ({
          render: () => "<span>Icon</span>",
        })),
      });
      const element = page.getByRole("button");
      await expect.element(element).toContainHTML("<span>Icon</span>");
    });

    it("renders all content together", async () => {
      const page = render(Component, {
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
        iconLeft: createRawSnippet(() => ({
          render: () => "<span class='icon-left'>Icon</span>",
        })),
        iconRight: createRawSnippet(() => ({
          render: () => "<span class='icon-right'>Icon</span>",
        })),
      });
      const element = page.getByRole("button");
      await expect.element(element).toContainHTML("<span>Click me</span>");
      await expect
        .element(element)
        .toContainHTML("<span class='icon-left'>Icon</span>");
      await expect
        .element(element)
        .toContainHTML("<span class='icon-right'>Icon</span>");
    });

    it("renders spinner when loading", async () => {
      const page = render(Component, {
        loading: true,
      });
      const element = page.getByRole("button");
      await expect.element(element).toHaveClass("loading");
    });

    it("hides content when loading", async () => {
      const page = render(Component, {
        loading: true,
        children: createRawSnippet(() => ({
          render: () => "<span>Click me</span>",
        })),
      });
      const element = page.getByText("Click me");
      await expect.element(element).not.toBeVisible();
    });
  });
});
