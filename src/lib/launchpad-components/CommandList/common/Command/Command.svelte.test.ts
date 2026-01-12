/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Command.svelte";

describe("Command component", () => {
  const baseProps = {
    command: "some command to run",
    href: "#line-42",
    status: null,
    "data-testid": "command",
  } satisfies ComponentProps<typeof Component> & { "data-testid": string };

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect.element(page.getByText("some command to run")).toBeVisible();
  });

  describe("Jump link", () => {
    it("is enabled when href is provided", async () => {
      const page = render(Component, { ...baseProps, href: "#line-42" });
      const jumpLink = jumpLinkLocator(page);
      await expect.element(jumpLink).toBeVisible();
      await expect.element(jumpLink).toHaveAttribute("href", "#line-42");
      await expect.element(jumpLink).toBeEnabled();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>): Locator {
  // li without list parent, does not have listitem role
  return page.getByTestId("command");
}

function jumpLinkLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByRole("link", { name: "Jump to command" });
}
