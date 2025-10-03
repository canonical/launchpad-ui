import type { Key, Modifier } from "./constants";

type OneModShortcut = `${Modifier}+${Key}`;
type TwoModShortcut = `${Modifier}+${Modifier}+${Key}`;
type ThreeModShortcut = `${Modifier}+${Modifier}+${Modifier}+${Key}`;

export type Shortcut = OneModShortcut | TwoModShortcut | ThreeModShortcut;
export type ShortcutPart = Key | Modifier;

export type MatchOptions = {
  /**
   * If true (default), the extra pressed modifiers disqualify the match.
   * If false, extra modifiers are allowed as long as all required ones are present.
   */
  exact?: boolean;
};

export type ParsedShortcut = {
  wants: {
    ctrl: boolean;
    alt: boolean;
    shift: boolean;
  };
  key: Key;
};
