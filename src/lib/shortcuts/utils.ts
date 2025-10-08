import {
  CODE_KEY_MAP,
  KEYS,
  MAC_MODIFIERS,
  STANDARD_MODIFIERS,
} from "./constants.js";
import type { Key, MacModifier, StandardModifier } from "./constants.js";

/**
 * Check if the current platform is a Mac platform.
 * Returns false on non-browser environments (e.g. SSR)
 */
export function isMacPlatform() {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform)
  );
}

export function isKey(key: unknown): key is Key {
  return typeof key === "string" && KEYS.includes(key as Key);
}

export function isStandardModifier(key: unknown): key is StandardModifier {
  return (
    typeof key === "string" &&
    STANDARD_MODIFIERS.includes(key as StandardModifier)
  );
}

export function isMacModifier(key: unknown): key is MacModifier {
  return typeof key === "string" && MAC_MODIFIERS.includes(key as MacModifier);
}

export function remapStandardModsToMacMods(
  mods: StandardModifier[],
): MacModifier[] {
  return mods.map((m) => {
    switch (m) {
      case "ctrl":
        return "cmd";
      case "alt":
        return "option";
      case "shift":
        return "shift";
    }
  });
}

/**
 * Normalize the event key to a consistent key.
 */
export function normalizeEventKey(eventCode: string): Key | undefined {
  const code = eventCode as keyof typeof CODE_KEY_MAP;
  return CODE_KEY_MAP[code];
}
