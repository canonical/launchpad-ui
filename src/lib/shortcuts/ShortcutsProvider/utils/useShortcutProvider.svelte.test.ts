import { beforeEach, describe, expect, it, vi } from "vitest";
import { Shortcut } from "../../Shortcut.svelte.js";
import type { ShortcutsContext } from "../types.js";
import { useShortcutProvider } from "./useShortcutProvider.svelte.js";

const setShortcutsContextMock = vi.hoisted(() => vi.fn());

vi.mock("../context.js", () => {
  return {
    setShortcutsContext: setShortcutsContextMock,
  };
});

describe("useShortcutProvider", () => {
  let context: ShortcutsContext | undefined;

  setShortcutsContextMock.mockImplementation((ctx) => {
    context = ctx;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    context = undefined;
  });

  describe("context", () => {
    it("sets the shortcuts context", () => {
      useShortcutProvider();
      expect(setShortcutsContextMock).toHaveBeenCalledTimes(1);
      expect(context).toBeDefined();
      expect(context?.shortcuts).toEqual([]);
      expect(context?.registerShortcuts).toBeInstanceOf(Function);
    });

    it("registers and unregisters shortcuts", () => {
      useShortcutProvider();
      const shortcut1 = new Shortcut("a", "label", () => {});
      const shortcut2 = new Shortcut("b", "label", () => {});

      const unregister = context?.registerShortcuts(shortcut1, shortcut2);
      expect(context?.shortcuts).toEqual([shortcut1, shortcut2]);

      unregister?.();
      expect(context?.shortcuts).toEqual([]);
    });
  });

  describe("onkeydown", () => {
    it("checks each shortcuts' matches method against the event", () => {
      const { onkeydown } = useShortcutProvider();
      const shortcut1 = new Shortcut("a", "label", () => {});
      const shortcut2 = new Shortcut("b", "label", () => {});
      context?.registerShortcuts(shortcut1, shortcut2);

      const shortcut1MatchesSpy = vi.spyOn(shortcut1, "matches");
      const shortcut2MatchesSpy = vi.spyOn(shortcut2, "matches");

      const event = new KeyboardEvent("keydown");
      onkeydown(event);

      expect(shortcut1MatchesSpy).toHaveBeenCalledWith(event);
      expect(shortcut2MatchesSpy).toHaveBeenCalledWith(event);
    });

    it("calls the callback of the matching shortcut", () => {
      const { onkeydown } = useShortcutProvider();
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const shortcut1 = new Shortcut("a", "label", callback1);
      const shortcut2 = new Shortcut("b", "label", callback2);
      context?.registerShortcuts(shortcut1, shortcut2);

      const event = new KeyboardEvent("keydown", { code: "KeyA" });
      onkeydown(event);

      expect(callback1).toHaveBeenCalledWith(event);
      expect(callback2).not.toHaveBeenCalled();
    });

    it("stops propagation and prevents default if specified in options", () => {
      const { onkeydown } = useShortcutProvider();
      const callback = vi.fn();
      const shortcut = new Shortcut("a", "label", callback, {
        preventDefault: true,
        stopPropagation: true,
      });
      context?.registerShortcuts(shortcut);

      const stopPropagationSpy = vi.spyOn(Event.prototype, "stopPropagation");
      const preventDefaultSpy = vi.spyOn(Event.prototype, "preventDefault");

      const event = new KeyboardEvent("keydown", { code: "KeyA" });
      onkeydown(event);

      expect(callback).toHaveBeenCalledWith(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
