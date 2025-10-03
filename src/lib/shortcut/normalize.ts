import type { Key } from "./constants";

export function normalizeEventKey(key: string): Key {
  // letters, digits, and punctuation unchanged
  const lower = key.toLowerCase();

  switch (lower) {
    case "esc":
      return "escape";
    case " ":
      return "space";
    // the rest match our key domain.
    default:
      return lower as Key;
  }
}
