/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { Locator } from "@vitest/browser/context";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ShortcutsProvider.svelte";

const { useShortcutProvider } = vi.hoisted(() => {
  const onkeydown = vi.fn();
  const useShortcutProvider = vi.fn(() => ({
    onkeydown,
  }));
  return { useShortcutProvider, onkeydown };
});

vi.mock("./utils/useShortcutProvider.svelte.js", () => {
  return {
    useShortcutProvider,
  };
});

const baseProps = {
  children: createRawSnippet(() => ({
    render: () => `<span>Content</span>`,
  })),
} satisfies ComponentProps<typeof Component>;

/**
 * Returns a locator for the ShortcutsProvider component.
 * Prefers semantic queries (e.g., getByRole) for better accessibility testing.
 */
function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("shortcuts-provider");
}

describe("ShortcutsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(componentLocator(page)).toBeInTheDocument();
    await expect.element(page.getByText("Content")).toBeInTheDocument();
    await expect
      .element(componentLocator(page))
      .toHaveStyle("display: contents");
  });

  describe("Basic attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, value) => {
      const page = render(Component, { ...baseProps, [attribute]: value });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, value);
    });
  });

  it("calls useShortcutProvider", async () => {
    render(Component, baseProps);
    expect(useShortcutProvider).toHaveBeenCalledOnce();
  });
});
