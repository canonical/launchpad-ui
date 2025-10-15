import { flushSync } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Shortcut } from "../../Shortcut.svelte.js";
import type { ShortcutsContext } from "../types.js";
import { useShortcuts } from "./useShortcuts.svelte.js";

let context: ShortcutsContext | undefined = vi.hoisted(() => undefined);

vi.mock("../context.js", () => {
  return {
    getShortcutsContext: vi.fn(() => context),
  };
});

describe("useShortcuts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("without ShortcutsProvider context", () => {
    it("logs an error and returns an empty array", () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const getShortcuts = useShortcuts();
      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      expect(getShortcuts()).toEqual([]);
    });
  });

  describe("with ShortcutsProvider context", () => {
    it("doesn't register shortcuts if getShortcut returns undefined", () => {
      const registerShortcutsSpy = vi.fn();
      context = {
        shortcuts: [],
        registerShortcuts: registerShortcutsSpy,
      };

      const destroy = $effect.root(() => {
        const getShortcuts = useShortcuts(() => undefined);
        expect(registerShortcutsSpy).not.toHaveBeenCalled();
        expect(getShortcuts()).toEqual([]);
      });
      destroy();
    });

    it("doesn't register shortcuts if getShortcut is not provided", () => {
      const registerShortcutsSpy = vi.fn();
      context = {
        shortcuts: [],
        registerShortcuts: registerShortcutsSpy,
      };

      const destroy = $effect.root(() => {
        const getShortcuts = useShortcuts();
        expect(registerShortcutsSpy).not.toHaveBeenCalled();
        expect(getShortcuts()).toEqual([]);
      });
      destroy();
    });

    it("registers and unregisters a single shortcut", () => {
      const shortcut = new Shortcut("a", { label: "label" }, () => {});
      const unregisterSpy = vi.fn();
      const registerShortcutsSpy = vi.fn().mockReturnValue(unregisterSpy);
      context = {
        shortcuts: [shortcut],
        registerShortcuts: registerShortcutsSpy,
      };

      const destroy = $effect.root(() => {
        const getShortcuts = useShortcuts(() => shortcut);
        flushSync();
        expect(getShortcuts()).toEqual([shortcut]);
      });
      destroy();
      expect(registerShortcutsSpy).toHaveBeenCalledOnce();
      expect(unregisterSpy).toHaveBeenCalledOnce();
    });

    it("registers and unregisters multiple shortcuts", () => {
      const shortcut1 = new Shortcut("a", { label: "label" }, () => {});
      const shortcut2 = new Shortcut("b", { label: "label" }, () => {});
      const unregisterSpy = vi.fn();
      const registerShortcutsSpy = vi.fn().mockReturnValue(unregisterSpy);
      context = {
        shortcuts: [],
        registerShortcuts: registerShortcutsSpy,
      };

      const destroy = $effect.root(() => {
        useShortcuts(() => [shortcut1, shortcut2]);
        flushSync();
      });
      destroy();
      expect(registerShortcutsSpy).toHaveBeenCalledOnce();
      expect(unregisterSpy).toHaveBeenCalledOnce();
    });
  });

  describe("reactivity", () => {
    it("registers and unregisters a new shortcut when getShortcut return changes", () => {
      let shortcut = $state<Shortcut | undefined>(undefined);
      const unregisterSpy = vi.fn();
      const registerShortcutsSpy = vi.fn().mockReturnValue(unregisterSpy);
      context = {
        shortcuts: [],
        registerShortcuts: registerShortcutsSpy,
      };

      const destroy = $effect.root(() => {
        expect(registerShortcutsSpy).not.toHaveBeenCalled();
        useShortcuts(() => shortcut);
        flushSync();
        expect(registerShortcutsSpy).not.toHaveBeenCalled();
        expect(unregisterSpy).not.toHaveBeenCalled();

        shortcut = new Shortcut("a", { label: "label" }, () => {});
        flushSync();
        expect(registerShortcutsSpy).toHaveBeenCalledExactlyOnceWith(shortcut);
        expect(unregisterSpy).not.toHaveBeenCalled();

        shortcut = new Shortcut("b", { label: "label" }, () => {});
        flushSync();
        expect(registerShortcutsSpy).toHaveBeenCalledTimes(2);
        expect(registerShortcutsSpy).toHaveBeenLastCalledWith(shortcut);
        expect(unregisterSpy).toHaveBeenCalledOnce();
      });
      destroy();
      expect(registerShortcutsSpy).toHaveBeenCalledTimes(2);
      expect(unregisterSpy).toHaveBeenCalledTimes(2);
    });
  });
});
