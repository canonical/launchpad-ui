/* @canonical/generator-ds 0.10.0-experimental.5 */

import { render } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("GlobalShortcutsProvider SSR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("doesn't throw", () => {
    expect(() => {
      render(Component, { props: { ...baseProps } });
    }).not.toThrow();
  });

  it("renders", () => {
    const page = render(Component, { props: { ...baseProps } });
    expect(page.container.innerHTML).toContain("Content");
  });

  it("calls useShortcutProvider", () => {
    render(Component, { props: { ...baseProps } });
    expect(useShortcutProvider).toHaveBeenCalledOnce();
  });
});
