/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./PartialListDisclosure.svelte";
import {
  children,
  hiddenItemText,
  visibleItemText,
} from "./test.fixtures.svelte";

describe("PartialListDisclosure component", () => {
  const baseProps = {
    children,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(listLocator(page)).toBeVisible();
    await expect.element(visibleItemLocator(page)).toBeVisible();
    await expect.element(hiddenItemLocator(page)).not.toBeVisible();
  });

  describe("attributes", () => {
    it("renders the list with an id", async () => {
      const page = render(Component, { ...baseProps });
      const list = listLocator(page);
      await expect.element(list).toHaveAttribute("id");
    });

    it("toggle button has aria-controls matching the list id", async () => {
      const page = render(Component, { ...baseProps });
      const list = listLocator(page);
      const toggleButton = page.getByRole("button");
      await expect
        .element(toggleButton)
        .toHaveAttribute("aria-controls", list.element().getAttribute("id"));
    });

    it("toggle button has aria-expanded set to false initially", async () => {
      const page = render(Component, { ...baseProps });
      const toggleButton = page.getByRole("button");
      await expect
        .element(toggleButton)
        .toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("interaction", () => {
    it("reveals hidden items when toggle button is clicked", async () => {
      const page = render(Component, { ...baseProps });
      const toggleButton = page.getByRole("button");
      await toggleButton.click();
      await expect.element(hiddenItemLocator(page)).toBeVisible();
      await expect
        .element(toggleButton)
        .toHaveAttribute("aria-expanded", "true");
    });
  });
});

function listLocator(page: RenderResult<typeof Component>) {
  return page.getByRole("list");
}

function visibleItemLocator(page: RenderResult<typeof Component>) {
  return page.getByText(visibleItemText);
}

function hiddenItemLocator(page: RenderResult<typeof Component>) {
  return page.getByText(hiddenItemText);
}
