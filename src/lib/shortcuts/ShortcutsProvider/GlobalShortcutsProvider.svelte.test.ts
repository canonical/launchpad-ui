/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./GlobalShortcutsProvider.svelte";

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

describe("GlobalShortcutsProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(page.getByText("Content")).toBeInTheDocument();
  });

  it("calls useShortcutProvider", async () => {
    render(Component, baseProps);
    expect(useShortcutProvider).toHaveBeenCalledOnce();
  });
});
