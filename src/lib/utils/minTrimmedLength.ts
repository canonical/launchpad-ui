/**
 * Returns `pattern` and `title` attributes that make an input invalid unless its trimmed value has at least `min` characters. Unlike `minlength`, surrounding whitespace doesn't count.
 *
 * @example
 * ```svelte
 * <input name="q" required {...minTrimmedLength(3)} />
 * ```
 */
export function minTrimmedLength(min: number): {
  pattern: string;
  title: string;
} {
  return {
    pattern:
      min <= 1 ? String.raw`\s*\S.*\s*` : String.raw`\s*\S.{${min - 2},}\S\s*`,
    title: `Enter at least ${min} ${min === 1 ? "character" : "characters"}`,
  };
}
