/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./ShortcutsProvider.svelte";
import type { ShortcutsProviderProps } from "./types.js";

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

describe("ShortcutsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>Content</span>`,
    })),
  } satisfies ShortcutsProviderProps;

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(testIdLocator(page)).toBeInTheDocument();
    await expect.element(page.getByText("Content")).toBeInTheDocument();
    await expect.element(testIdLocator(page)).toHaveStyle("display: contents");
  });

  it("calls useShortcutProvider", async () => {
    render(Component, baseProps);
    expect(useShortcutProvider).toHaveBeenCalledOnce();
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("shortcuts-provider");
}
