import { assert } from "../utils/index.js";
import type { Key, Modifier } from "./constants.js";
import { MODIFIERS } from "./constants.js";
import type { ParsedShortcut, Shortcut, ShortcutPart } from "./type.js";

export function parse(shortcut: Shortcut): ParsedShortcut {
  const parts = shortcut.split("+").filter(Boolean) as ShortcutPart[];

  const mods = new Set(parts.filter((p) => MODIFIERS.includes(p as Modifier)));
  const key = parts.find((p) => !MODIFIERS.includes(p as Modifier)) as Key;

  assert(Boolean(key), `Invalid shortcut, missing key ${shortcut}`);

  const wants: ParsedShortcut["wants"] = {
    ctrl: mods.has("ctrl"),
    alt: mods.has("alt"),
    shift: mods.has("shift"),
  };

  return {
    wants,
    key,
  };
}
