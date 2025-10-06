import { assert } from "../utils/index.js";
import type {
  Key,
  MacModifier,
  Modifier,
  StandardModifier,
} from "./constants.js";
import { MAC_MODIFIERS, STANDARD_MODIFIERS } from "./constants.js";
import { isMac } from "./platform.js";
import type {
  MacShortcut,
  MacShortcutPart,
  Shortcut,
  StandardShortcut,
  StandardShortcutPart,
} from "./type.js";

/**
 * Parse a shortcut into a flat list of modifiers and key to be formatted as wished.
 */
export function parse(shortcut: Shortcut): [...Modifier[], Key] {
  const [standard, mac] = Array.isArray(shortcut)
    ? shortcut
    : ([shortcut, undefined] as [StandardShortcut, MacShortcut | undefined]);
  const standardParts = standard
    .split("+")
    .filter(Boolean) as StandardShortcutPart[];
  const standardMods = standardParts.filter((p) =>
    STANDARD_MODIFIERS.includes(p as StandardModifier),
  ) as StandardModifier[];

  const key = standardParts.find(
    (p) => !STANDARD_MODIFIERS.includes(p as StandardModifier),
  ) as Key;
  assert(Boolean(key), `Invalid shortcut, missing key ${shortcut}`);

  if (!isMac()) return [...standardMods, key];

  const macParts = mac && (mac.split("+").filter(Boolean) as MacShortcutPart[]);
  const macMods = macParts
    ? (macParts.filter((p) =>
        MAC_MODIFIERS.includes(p as MacModifier),
      ) as MacModifier[])
    : standardMods.map((m) => {
        switch (m) {
          case "ctrl":
            return "cmd";
          case "alt":
            return "option";
          case "shift":
            return "shift";
        }
      });
  const macKey = macParts
    ? (macParts.find((p) => !MAC_MODIFIERS.includes(p as MacModifier)) as Key)
    : key;

  assert(Boolean(macKey), `Invalid shortcut, missing mac key ${shortcut}`);

  return [...macMods, macKey];
}
