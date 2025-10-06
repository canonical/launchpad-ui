import { normalizeEventKey } from "./normalize.js";
import { parse } from "./parse.js";
import { isMac } from "./platform.js";
import type { MatchOptions, Shortcut } from "./type.js";

/**
 * Check if a `KeyboardEvent` matches a shortcut.
 * By default, extra pressed modifiers disqualify the match.
 */
export function match(
  e: KeyboardEvent,
  shortcut: Shortcut,
  opts: MatchOptions = {},
) {
  const exact = opts.exact ?? true;

  const parsed = parse(shortcut);
  const wants = {
    ctrl: parsed.includes("ctrl") || (isMac() && parsed.includes("cmd")),
    alt: parsed.includes("alt") || (isMac() && parsed.includes("option")),
    shift: parsed.includes("shift"),
  };

  // We consider ctrl as cmd on mac
  // which means two keys can trigger the cmd key.
  // Mac ctrl key is not a common in shortcuts.
  const event = {
    ctrl: isMac() ? e.metaKey || e.ctrlKey : e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
  };

  const key = normalizeEventKey(e.code);

  const mismatch = [
    wants.ctrl && !event.ctrl,
    wants.alt && !event.alt,
    wants.shift && !event.shift,
    parsed.at(-1) !== key,
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
