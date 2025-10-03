import { assert } from "../utils/index.js";
import type { Key, Modifier } from "./constants.js";
import { MODIFIERS } from "./constants.js";
import { isMac } from "./platform.js";
import type { Shortcut, ShortcutPart } from "./type.js";

export function format(shortcut: Shortcut): [...(Modifier | "cmd")[], Key] {
  const parts = shortcut.split("+").filter(Boolean) as ShortcutPart[];
  const mods = (
    parts.filter((p) => MODIFIERS.includes(p as Modifier)) as Modifier[]
  ).map((p) => {
    if (p === "ctrl") return isMac() ? "cmd" : "ctrl";
    return p;
  });

  const key = parts.find((p) => !MODIFIERS.includes(p as Modifier)) as Key;
  assert(Boolean(key), `Invalid shortcut, missing key ${shortcut}`);
  return [...mods, key];
}
