import type { Key, MacModifier, Modifier, StandardModifier } from "./constants";

type OneModShortcut<M extends string> = `${M}+${Key}`;
type TwoModShortcut<
  M1 extends string,
  M2 extends string,
> = `${M1}+${M2}+${Key}`;

type ShortcutExpression<M1 extends string, M2 extends string = M1> =
  | Key
  | OneModShortcut<M1>
  | TwoModShortcut<M1, M2>;

export type StandardShortcut = ShortcutExpression<StandardModifier>;
export type MacShortcut = ShortcutExpression<MacModifier>;

export type ShortcutOptions = {
  /**
   * If true, the extra pressed modifiers disqualify the match.
   * If false, extra modifiers are allowed as long as all required ones are present.
   *
   * @default true
   */
  exact: boolean;
  /**
   * If true, the event's default action will be prevented when the shortcut is triggered.
   *
   * @default true
   */
  preventDefault: boolean;
  /**
   * If true, the event's propagation will be stopped when the shortcut is triggered.
   *
   * Note: This does not stop other matching shortcuts from being triggered.
   * Note: The propagation is stopped on provider level. So the event will reach all elements between the target and the provider.
   *
   * @default true
   */
  stopPropagation: boolean;
  /**
   * An optional predicate that must return true for the shortcut to be triggered.
   * This can be used to add additional conditions, e.g. checking the event target.
   *
   * If the predicate returns false, the `preventDefault` and `stopPropagation` options will not be applied, so the event will behave as if the shortcut was not matched and will continue to propagate normally.
   *
   * @param event The keyboard event
   * @returns Whether the shortcut should be triggered
   */
  predicate?: (event: KeyboardEvent) => boolean;
};

export type ParsedShortcut = [...Modifier[], Key];

export type ShortcutMetadata = {
  label: string;
  description?: string;
  category?: string;
};
