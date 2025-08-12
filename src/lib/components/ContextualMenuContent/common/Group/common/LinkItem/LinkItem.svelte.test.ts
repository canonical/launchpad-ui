/* @canonical/generator-ds 0.10.0-experimental.0 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./LinkItem.svelte";

describe("LinkItem component", () => {
  describe("Renders", () => {
    it("renders", async () => {
      const page = render(Component, { text: "Item", href: "#" });
      await expect.element(page.getByRole("link")).toBeInTheDocument();
    });

    it("renders secondary text", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        secondaryText: "Secondary",
      });
      await expect.element(page.getByText("Secondary")).toBeInTheDocument();
    });

    it("renders trailing text", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        trailingText: "Trailing",
      });
      await expect.element(page.getByText("Trailing")).toBeInTheDocument();
    });

    it("renders icon", async () => {
      const icon = "<span data-testid='icon'>Icon</span>";
      const page = render(Component, {
        text: "Item",
        href: "#",
        icon: createRawSnippet(() => ({ render: () => icon })),
      });
      await expect.element(page.getByTestId("icon")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        id: "test-id",
      });
      await expect
        .element(page.getByRole("link"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        class: "test-class",
      });
      await expect.element(page.getByRole("link")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        style: "color: red;",
      });
      await expect.element(page.getByRole("link")).toHaveStyle("color: red;");
    });
  });

  describe("Link-specific", () => {
    it("has correct href", async () => {
      const page = render(Component, {
        text: "Item",
        href: "https://example.com",
      });
      await expect
        .element(page.getByRole("link"))
        .toHaveAttribute("href", "https://example.com");
    });

    it("is not disabled by default", async () => {
      const page = render(Component, { text: "Item", href: "#" });
      await expect
        .element(page.getByRole("link"))
        .not.toHaveAttribute("aria-disabled", "true");
    });

    it("can be disabled", async () => {
      const page = render(Component, {
        text: "Item",
        href: "#",
        disabled: true,
      });
      await expect
        .element(page.getByRole("link"))
        .toHaveAttribute("aria-disabled", "true");
    });
  });
});
