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
  "=",
  "+",
  "-",
  "_",
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

export type Key = NamedKey | Letter | Digit | Punctuation;
