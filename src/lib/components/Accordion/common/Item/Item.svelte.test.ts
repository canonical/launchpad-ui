import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { AccordionContext } from "../../types.js";
import Component from "./Item.svelte";
import { contentText, heading, headingText } from "./test.fixtures.svelte";

let { name } = vi.hoisted(
  (): AccordionContext => ({
    name: undefined,
  }),
);

vi.mock("../../context.js", () => {
  return {
    getAccordionContext: (): AccordionContext => ({ name }),
  };
});

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

  describe("exclusive mode", () => {
    afterEach(() => {
      name = undefined;
    });

    it("gets a name attribute from the Accordion context", async () => {
      name = "test-name";
      const page = render(Component, {
        ...baseProps,
      });

      await expect
        .element(componentLocator(page))
        .toHaveAttribute("name", "test-name");
    });

    it("can override the Accordion context name with a prop", async () => {
      name = "test-name";
      const page = render(Component, {
        ...baseProps,
        name: "override-name",
      });

      await expect
        .element(componentLocator(page))
        .toHaveAttribute("name", "override-name");
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("item-root");
}
