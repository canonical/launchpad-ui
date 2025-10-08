export const STANDARD_MODIFIERS = ["ctrl", "alt", "shift"] as const;
export type StandardModifier = (typeof STANDARD_MODIFIERS)[number];

export const MAC_MODIFIERS = ["cmd", "option", "shift"] as const;
export type MacModifier = (typeof MAC_MODIFIERS)[number];

export const MODIFIERS = [...STANDARD_MODIFIERS, ...MAC_MODIFIERS] as const;
export type Modifier = (typeof MODIFIERS)[number];

export const NAMED_KEYS = [
  "enter",
  "escape",
  "tab",
  "backspace",
  "delete",
  "space",
  "home",
  "end",
  "pageup",
  "pagedown",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
] as const;

export type NamedKey = (typeof NAMED_KEYS)[number];

export const LETTERS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
] as const;

export type Letter = (typeof LETTERS)[number];

export const DIGITS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
] as const;

export type Digit = (typeof DIGITS)[number];

export const PUNCTUATIONS = [
  "/",
  ".",
  ",",
  ";",
  ":",
  "!",
  "?",
  "~",
  "`",
  "|",
  "*",
  "\\",
  "{",
  "}",
  "[",
  "]",
  "(",
  ")",
  "<",
  ">",
] as const;

export type Punctuation = (typeof PUNCTUATIONS)[number];

export const KEYS = [
  ...NAMED_KEYS,
  ...LETTERS,
  ...DIGITS,
  ...PUNCTUATIONS,
] as const;
export type Key = (typeof KEYS)[number];

/**
 * This is an important mapping, we cannot depend on `e.key` for normalization.
 * event key changes value for the same physical key depending on active modifiers.
 * For example, `Shift+1` is `!` when shift is active, but `1` when it is not.
 * However, `e.code` is consistent across different key modifiers states.
 */
export const CODE_KEY_MAP = {
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
  NumpadDecimal: ".",
  NumpadDivide: "/",
  Semicolon: ";",
  Comma: ",",
  Period: ".",
  Slash: "/",
  Backquote: "`",
  BracketLeft: "[",
  Backslash: "\\",
  BracketRight: "]",
} as const satisfies Record<string, Key>;
