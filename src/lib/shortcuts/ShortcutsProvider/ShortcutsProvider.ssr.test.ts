/* @canonical/generator-ds 0.10.0-experimental.3 */

import { render } from "@canonical/svelte-ssr-test";
import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

describe("ShortcutsProvider SSR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    children: createRawSnippet(() => ({
      render: () => `<span>Content</span>`,
    })),
  } satisfies ShortcutsProviderProps;

  describe("basics", () => {
    it("doesn't throw", () => {
      expect(() => {
        render(Component, { props: { ...baseProps } });
      }).not.toThrow();
    });

    it("renders", () => {
      const { window, container } = render(Component, {
        props: { ...baseProps },
      });
      expect(container.firstElementChild).toBeInstanceOf(window.HTMLDivElement);
    });
  });

  it("calls useShortcutProvider", () => {
    render(Component, {
      props: { ...baseProps },
    });
    expect(useShortcutProvider).toHaveBeenCalledOnce();
  });
});
