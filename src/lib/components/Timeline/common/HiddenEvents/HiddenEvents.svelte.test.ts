/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./HiddenEvents.svelte";

describe("HiddenEvents component", () => {
  const baseProps = {
    numHidden: 0,
  } satisfies ComponentProps<typeof Component>;

  describe("basics", () => {
    it("renders", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(componentLocator(page)).toBeInTheDocument();
    });
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      const element = componentLocator(page);
      await expect.element(element).toHaveClass("ds");
      await expect.element(element).toHaveClass("timeline-hidden-events");
      await expect.element(element).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { ...baseProps, style: "color: orange;" });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("Renders", () => {
    it("hidden events number", async () => {
      const page = render(Component, { ...baseProps, numHidden: 888 });
      await expect.element(componentLocator(page)).toHaveTextContent("888");
    });

    describe("Links", () => {
      it("without the links by default", async () => {
        const page = render(Component, { ...baseProps });
        await expect.element(page.getByRole("link")).not.toBeInTheDocument();
      });

      it("renders child links", async () => {
        const page = render(Component, {
          ...baseProps,
          children: hiddenLinks([["Show more", "/show-more"]]),
        });
        await expect
          .element(page.getByRole("link", { name: "Show more" }))
          .toHaveAttribute("href", "/show-more");
      });

      it("renders multiple child links", async () => {
        const page = render(Component, {
          ...baseProps,
          children: hiddenLinks([
            ["Show more", "/show-more"],
            ["Show all", "/show-all"],
          ]),
        });
        await expect
          .element(page.getByRole("link", { name: "Show more" }))
          .toHaveAttribute("href", "/show-more");
        await expect
          .element(page.getByRole("link", { name: "Show all" }))
          .toHaveAttribute("href", "/show-all");
      });
    });
  });
});

function hiddenLinks(
  links: Array<[label: string, href: string]>,
): NonNullable<ComponentProps<typeof Component>["children"]> {
  return createRawSnippet(() => ({
    render: () =>
      `<span>${links
        .map(
          ([label, href]) =>
            `<span class="link-separator" aria-hidden="true"></span><a href="${href}" class="show-link">${label}</a>`,
        )
        .join("")}</span>`,
  }));
}

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("listitem");
}
