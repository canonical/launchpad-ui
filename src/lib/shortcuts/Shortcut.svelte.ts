import { assert, assertDefined } from "$lib/utils";
import type { Modifier } from "./constants";
import type {
  MacShortcut,
  ParsedShortcut,
  ShortcutMetadata,
  ShortcutOptions,
  StandardShortcut,
} from "./type";
import {
  isKey,
  isMacModifier,
  isMacPlatform,
  isStandardModifier,
  normalizeEventKey,
  remapStandardModsToMacMods,
} from "./utils.js";

/**
 * A shortcut is a combination of shortcut expression, some metadata and a callback.
 *
 * The shortcut expression can be a standard shortcut or a mac shortcut specific.
 *
 * @example
 * // standard shortcut
 * const shortcut = new Shortcut("ctrl+k", {label: "Insert Link"}, (event) => {
 *   document.execCommand("insertText", false, "[");
 * });
 *
 * // shortcut with mac shortcut
 * const shortcut = new Shortcut(["ctrl+k", "cmd+option+k"], {label: "Open modal"}, (event) => {
 *   openModal();
 * });
 */
export class Shortcut {
  public readonly parsedShortcut: ParsedShortcut;
  private readonly _standardShortcut: StandardShortcut;
  private readonly _macShortcut?: MacShortcut;
  public readonly options: ShortcutOptions;
  private _enabled: boolean;
  private readonly _isMacPlatform = isMacPlatform();

  constructor(
    shortcut: StandardShortcut | [StandardShortcut, MacShortcut],
    public readonly metadata: ShortcutMetadata,
    public readonly callback: (event: KeyboardEvent) => void,
    options: Partial<ShortcutOptions> = {},
    enabled = true,
  ) {
    this._enabled = $state(enabled);

    if (Array.isArray(shortcut)) {
      [this._standardShortcut, this._macShortcut] = shortcut;
    } else {
      this._standardShortcut = shortcut;
    }

    this.parsedShortcut = this.parse();

    this.options = {
      exact: true,
      preventDefault: true,
      stopPropagation: true,
      ...options,
    };
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  /**
   * Convert the shortcut to an aria-keyshortcuts attribute value.
   *
   * {@link https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-keyshortcuts | MDN Aria Keyshortcuts }
   */
  toAriaLabel(): string {
    const metaParts = this.parsedShortcut.slice(0, -1).map((p): string => {
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
    const key = this.parsedShortcut.at(-1);
    assertDefined(key, `Invalid shortcut, missing key ${this._macShortcut}`);
    return [...metaParts, key].join("+");
  }

  /**
   * Convert the shortcut to a human readable string.
   */
  toHumanReadable(): string {
    return this.parsedShortcut.join("+");
  }

  /**
   * Parse the shortcut into a flat list of modifiers and key to be formatted as wished.
   */
  private parse(): ParsedShortcut {
    const standardMods = this._standardShortcut.split("+");
    let key = standardMods.pop();
    assert(
      standardMods.every((m) => isStandardModifier(m)),
      `Invalid shortcut, invalid standard modifier ${this._standardShortcut}`,
    );
    assert(isKey(key), `Invalid shortcut, invalid key '${String(key)}'`);

    if (!this._isMacPlatform) return [...standardMods, key];

    if (!this._macShortcut) {
      return [...remapStandardModsToMacMods(standardMods), key];
    }

    const macMods = this._macShortcut.split("+");
    key = macMods.pop();
    assert(
      macMods.every((m) => isMacModifier(m)),
      `Invalid shortcut, invalid mac modifier ${this._macShortcut}`,
    );
    assert(isKey(key), `Invalid shortcut, invalid mac key '${String(key)}'`);

    return [...macMods, key];
  }

  /**
   * Check if a `KeyboardEvent` matches a shortcut.
   * By default, extra pressed modifiers disqualify the match.
   */
  matches(e: KeyboardEvent): boolean {
    if (!this.enabled) return false;
    if (this.options.predicate && !this.options.predicate(e)) return false;

    const wants = {
      ctrl:
        this.parsedShortcut.includes("ctrl") ||
        (this._isMacPlatform && this.parsedShortcut.includes("cmd")),
      alt:
        this.parsedShortcut.includes("alt") ||
        (this._isMacPlatform && this.parsedShortcut.includes("option")),
      shift: this.parsedShortcut.includes("shift"),
    };

    // We consider ctrl as cmd on mac
    // which means two keys can trigger the cmd key.
    // Mac ctrl key is not a common in shortcuts.
    const event = {
      ctrl: this._isMacPlatform ? e.metaKey || e.ctrlKey : e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
    };

    const key = normalizeEventKey(e.code);
    if (!key) return false;

    const mismatch =
      (wants.ctrl && !event.ctrl) ||
      (wants.alt && !event.alt) ||
      (wants.shift && !event.shift) ||
      this.parsedShortcut.at(-1) !== key;

    if (mismatch) return false;

    if (!this.options.exact) return true;

    // When exact is true, disqualify if there are extra modifiers beyond what is required.
    // Example: shortcut wants only ctrl, but event has ctrl+shift → should not match.
    const hasExtraMods =
      (event.ctrl && !wants.ctrl) ||
      (event.alt && !wants.alt) ||
      (event.shift && !wants.shift);

    return !hasExtraMods;
  }
}
