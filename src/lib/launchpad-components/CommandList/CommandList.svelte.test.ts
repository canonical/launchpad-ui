/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./CommandList.svelte";
import { children } from "./test.fixture.svelte";

describe("CommandList component", () => {
  const baseProps = {
    children,
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  it("renders children", async () => {
    const page = render(Component, { ...baseProps });
    expect(itemLocator(page).elements().length).toBe(3);
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("list");
}

function itemLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("listitem");
}
