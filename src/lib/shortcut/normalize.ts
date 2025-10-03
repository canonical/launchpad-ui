import { assert } from "../utils";
import type { Key } from "./constants";

/**
 * Normalize the event key to a consistent key.
 */
export function normalizeEventKey(eventCode: string): Key {
  const code = eventCode as keyof typeof CODE_KEY_MAP;
  const key = CODE_KEY_MAP[code];
  assert(key, `Invalid event code: ${eventCode}`);
  return key as Key;
}

/**
 * This is an important mapping, we cannot depend on `e.key` for normalization.
 * event key changes value for the same physical key depending on active modifiers.
 * For example, `Shift+1` is `!` when shift is active, but `1` when it is not.
 * However, `e.code` is consistent across different key modifiers states.
 */
const CODE_KEY_MAP = {
  Enter: "enter",
  Escape: "escape",
  Space: "space",
  PageUp: "pageup",
  PageDown: "pagedown",
  End: "end",
  Home: "home",
  ArrowLeft: "arrowleft",
  ArrowUp: "arrowup",
  ArrowRight: "arrowright",
  ArrowDown: "arrowdown",
  Delete: "delete",
  Digit0: "0",
  Digit1: "1",
  Digit2: "2",
  Digit3: "3",
  Digit4: "4",
  Digit5: "5",
  Digit6: "6",
  Digit7: "7",
  Digit8: "8",
  Digit9: "9",
  KeyA: "a",
  KeyB: "b",
  KeyC: "c",
  KeyD: "d",
  KeyE: "e",
  KeyF: "f",
  KeyG: "g",
  KeyH: "h",
  KeyI: "i",
  KeyJ: "j",
  KeyK: "k",
  KeyL: "l",
  KeyM: "m",
  KeyN: "n",
  KeyO: "o",
  KeyP: "p",
  KeyQ: "q",
  KeyR: "r",
  KeyS: "s",
  KeyT: "t",
  KeyU: "u",
  KeyV: "v",
  KeyW: "w",
  KeyX: "x",
  KeyY: "y",
  KeyZ: "z",
  Numpad0: "0",
  Numpad1: "1",
  Numpad2: "2",
  Numpad3: "3",
  Numpad4: "4",
  Numpad5: "5",
  Numpad6: "6",
  Numpad7: "7",
  Numpad8: "8",
  Numpad9: "9",
  NumpadMultiply: "*",
  NumpadAdd: "+",
  NumpadSubtract: "-",
  NumpadDecimal: ".",
  NumpadDivide: "/",
  Semicolon: ";",
  Equal: "=",
  Comma: ",",
  Minus: "-",
  Period: ".",
  Slash: "/",
  Backquote: "`",
  BracketLeft: "[",
  Backslash: "\\",
  BracketRight: "]",
} as const satisfies Record<string, Key>;
