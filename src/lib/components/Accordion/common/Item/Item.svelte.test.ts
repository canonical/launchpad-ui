import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Item.svelte";
import { contentText, heading, headingText } from "./test.fixtures.svelte";

describe("Accordion.Item component", () => {
  const baseProps = {
    heading,
    "data-testid": "item-root",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect.element(page.getByText(headingText)).toBeInTheDocument();
  });

  it("renders a string heading", async () => {
    const page = render(Component, {
      ...baseProps,
      heading: headingText,
    });
    await expect.element(page.getByText(headingText)).toBeInTheDocument();
  });

  describe("interaction", () => {
    it("toggles open when summary is clicked", async () => {
      const page = render(Component, { ...baseProps });
      const details = componentLocator(page);

      await expect.element(details).not.toHaveAttribute("open");
      await page.getByText(headingText).click();
      await expect.element(details).toHaveAttribute("open");
      await page.getByText(headingText).click();
      await expect.element(details).not.toHaveAttribute("open");
    });
  });

  describe("content", () => {
    it("shows the children content when open", async () => {
      const page = render(Component, {
        ...baseProps,
        open: true,
        children: createRawSnippet(() => ({
          render: () => `<span>${contentText}</span>`,
        })),
      });
      await expect.element(page.getByText(contentText)).toBeVisible();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("item-root");
}
