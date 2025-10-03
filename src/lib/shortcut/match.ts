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
  const event = {
    ctrl: e.ctrlKey || (isMac() && e.metaKey),
    alt: e.altKey,
    shift: e.shiftKey,
    key: normalizeEventKey(e.key),
  };

  const mismatch = [
    parsed.wants.ctrl && !event.ctrl,
    parsed.wants.alt && !event.alt,
    parsed.wants.shift && !event.shift,
    parsed.key !== event.key,
  ].some(Boolean);

  if (mismatch) return false;

  if (!exact) return true;

  // When exact is true, disqualify if there are extra modifiers beyond what is required.
  // Example: shortcut wants only ctrl, but event has ctrl+shift → should not match.
  const hasExtraMods = [
    event.ctrl && !parsed.wants.ctrl,
    event.alt && !parsed.wants.alt,
    event.shift && !parsed.wants.shift,
  ].some(Boolean);

  return !hasExtraMods;
}
