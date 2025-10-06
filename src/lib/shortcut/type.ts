import type { Key, MacModifier, StandardModifier } from "./constants";

type OneModShortcut<M extends string> = `${M}+${Key}`;
type TwoModShortcut<
  M1 extends string,
  M2 extends string,
> = `${M1}+${M2}+${Key}`;

export type ShortcutExpression<M1 extends string, M2 extends string> =
  | OneModShortcut<M1>
  | TwoModShortcut<M1, M2>;

export type StandardShortcut = ShortcutExpression<
  "ctrl",
  Exclude<StandardModifier, "ctrl">
>;
export type MacShortcut = ShortcutExpression<
  "cmd",
  Exclude<MacModifier, "cmd">
>;

export type Shortcut =
  | StandardShortcut
  | MacShortcut
  | [StandardShortcut, MacShortcut];

export type StandardShortcutPart = Key | StandardModifier;
export type MacShortcutPart = Key | MacModifier;

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
