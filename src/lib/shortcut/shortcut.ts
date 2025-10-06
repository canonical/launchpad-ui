import { assertDefined } from "$lib/utils";
import type { Key, MacModifier, Modifier, StandardModifier } from "./constants";
import { CODE_KEY_MAP, MAC_MODIFIERS, STANDARD_MODIFIERS } from "./constants";
import type {
  MacShortcut,
  MacShortcutPart,
  MatchOptions,
  ParsedShortcut,
  ShortcutCallback,
  StandardShortcut,
  StandardShortcutPart,
} from "./type";

/**
 * A shortcut is a combination of shortcut expression, some metadata and a callback.
 *
 * It can be used along with a `ShortcutsManager` to register and unregister shortcuts for an element.
 *
 * The shortcut expression can be a standard shortcut or a mac shortcut specific.
 *
 * @example
 * // standard shortcut
 * const shortcut = new Shortcut("ctrl+k", "Insert Link", (element) => {
 *   element.focus();
 *   document.execCommand("insertText", false, "[");
 * });
 *
 * // shortcut with mac shortcut
 * const shortcut = new Shortcut("ctrl+k", "cmd+option+k", "Insert Link", (element) => {
 *   element.focus();
 *   document.execCommand("insertText", false, "[");
 * });
 */
export class Shortcut<T extends HTMLElement = HTMLElement> {
  public readonly label: string;
  public readonly callback: ShortcutCallback<T>;
  public readonly shortcut: ParsedShortcut;
  private readonly _standardShortcut: StandardShortcut;
  private readonly _macShortcut?: MacShortcut;

  constructor(
    shortcut: StandardShortcut,
    label: string,
    callback: ShortcutCallback<T>,
  );
  constructor(
    shortcut: StandardShortcut,
    macShortcut: MacShortcut,
    label: string,
    callback: ShortcutCallback<T>,
  );
  constructor(
    shortcut: StandardShortcut,
    labelOrMacShortcut: MacShortcut | string,
    labelOrCallback: string | ShortcutCallback<T>,
    callbackOrEmpty?: ShortcutCallback<T>,
  ) {
    this._standardShortcut = shortcut;
    if (callbackOrEmpty !== undefined) {
      this.label = labelOrCallback as string;
      this._macShortcut = labelOrMacShortcut as MacShortcut;
      this.callback = callbackOrEmpty as ShortcutCallback<T>;
    } else {
      this.label = labelOrMacShortcut as string;
      this.callback = labelOrCallback as ShortcutCallback<T>;
    }
    this.shortcut = this.parse();
  }

  /**
   * Convert the shortcut to an aria-keyshortcuts attribute value.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts | MDN Aria Keyshortcuts }
   */
  toAriaLabel(): string {
    const metaParts = this.shortcut.slice(0, -1).map((p): string => {
      switch (p as Modifier) {
        case "cmd":
          return "Meta";
        case "option":
          return "AltGraph";
        case "shift":
          return "Shift";
        case "ctrl":
          return "Control";
        case "alt":
          return "Alt";
      }
    });
    const key = this.shortcut.at(-1);
    assertDefined(key, `Invalid shortcut, missing key ${this._macShortcut}`);
    return [...metaParts, key].join("+");
  }

  /**
   * Convert the shortcut to a human readable string.
   */
  toHumanReadable(): string {
    return this.shortcut.join("+");
  }

  /**
   * Parse the shortcut into a flat list of modifiers and key to be formatted as wished.
   */
  parse(): ParsedShortcut {
    const standardParts = this._standardShortcut
      .split("+")
      .filter(Boolean) as StandardShortcutPart[];
    const standardMods = standardParts.filter((p) =>
      STANDARD_MODIFIERS.includes(p as StandardModifier),
    ) as StandardModifier[];

    const key = standardParts.find(
      (p) => !STANDARD_MODIFIERS.includes(p as StandardModifier),
    ) as Key;
    assertDefined(
      key,
      `Invalid shortcut, missing key ${this._standardShortcut}`,
    );

    if (!Shortcut.isMac()) return [...standardMods, key];

    const macParts =
      this._macShortcut &&
      (this._macShortcut.split("+").filter(Boolean) as MacShortcutPart[]);
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

    assertDefined(
      macKey,
      `Invalid shortcut, missing mac key ${this._macShortcut}`,
    );

    return [...macMods, macKey];
  }

  /**
   * Normalize the event key to a consistent key.
   */
  private static normalizeEventKey(eventCode: string): Key | undefined {
    const code = eventCode as keyof typeof CODE_KEY_MAP;
    return CODE_KEY_MAP[code];
  }

  /**
   * Check if a `KeyboardEvent` matches a shortcut.
   * By default, extra pressed modifiers disqualify the match.
   */
  match(e: KeyboardEvent, opts: MatchOptions = {}) {
    const exact = opts.exact ?? true;

    const wants = {
      ctrl:
        this.shortcut.includes("ctrl") ||
        (Shortcut.isMac() && this.shortcut.includes("cmd")),
      alt:
        this.shortcut.includes("alt") ||
        (Shortcut.isMac() && this.shortcut.includes("option")),
      shift: this.shortcut.includes("shift"),
    };

    // We consider ctrl as cmd on mac
    // which means two keys can trigger the cmd key.
    // Mac ctrl key is not a common in shortcuts.
    const event = {
      ctrl: Shortcut.isMac() ? e.metaKey || e.ctrlKey : e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    };

    const key = Shortcut.normalizeEventKey(e.code);
    if (!key) return false;

    const mismatch = [
      wants.ctrl && !event.ctrl,
      wants.alt && !event.alt,
      wants.shift && !event.shift,
      this.shortcut.at(-1) !== key,
    ].some(Boolean);

    if (mismatch) return false;

    if (!exact) return true;

    // When exact is true, disqualify if there are extra modifiers beyond what is required.
    // Example: shortcut wants only ctrl, but event has ctrl+shift → should not match.
    const hasExtraMods = [
      event.ctrl && !wants.ctrl,
      event.alt && !wants.alt,
      event.shift && !wants.shift,
    ].some(Boolean);

    return !hasExtraMods;
  }

  /**
   *
   * @returns False if the platform is not mac or Mac but
   * during SSR and then true once loaded in the browser.
   */
  private static isMac() {
    return (
      typeof navigator !== "undefined" &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    );
  }
}
