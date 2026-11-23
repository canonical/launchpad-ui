type FilterText = string | readonly [label: string, text: string];

/**
 * Turns a set filter value into text.
 *
 * @param value The filter's value.
 * @param filters All current filter values, for text that depends on another filter.
 * @returns The text, or `null` to leave the filter out.
 */
type FilterTextFn<TValue, TFilters> = (
  value: TValue,
  filters: TFilters,
) => FilterText | null;

/** How one filter is turned into text. */
type FilterEntry<TValue, TFilters> = {
  /**
   * The filter's name, such as `"Series"`. Also usable as its form field label.
   */
  label: string;
  /**
   * The filter as text.
   *
   * Gets the filter's value, never `undefined`, and all filter values.
   *
   * @returns The text, or `null` to leave the filter out.
   * @default (value) => [label, String(value)]
   * @example (enabled) => (enabled ? "All statuses" : null)
   * @example (search, { match }) => [SEARCH_MODE_LABELS[match], `"${search}"`]
   */
  text?: FilterTextFn<TValue, TFilters>;
  /**
   * A shorter form of {@link FilterEntry.text | text}, for where space is tight.
   *
   * Gets the same arguments as {@link FilterEntry.text | text}.
   *
   * @returns The text, or `null` to leave the filter out of the short form only.
   * @default text
   * @example (series) => series
   */
  shortText?: FilterTextFn<TValue, TFilters>;
};

/**
 * How each filter of a page is represented. Key order is the default display order.
 * Filters whose value is `undefined` always skipped.
 */
export type FilterRepresentationConfig<TFilters extends object> = {
  readonly [K in keyof TFilters & string]-?: FilterEntry<
    Exclude<TFilters[K], undefined>,
    TFilters
  >;
};

export type FilterTextPart<TFilters extends object> = {
  /** The filter this part shows. */
  key: keyof TFilters & string;
  /** Shown before {@link FilterTextPart.text | text}, as in `Series: noble`. Missing for plain-text parts. */
  label?: string;
  /** The text after {@link FilterTextPart.label | label}, or all of the text when there is no label. */
  text: string;
};

/**
 * Joins the short-form filter text with `" + "`.
 * @param maxLength Optional character limit, including the ellipsis when truncated.
 * @throws {RangeError} If `maxLength` is negative.
 */
export function getShortFilterText<TFilters extends object>(
  config: FilterRepresentationConfig<NoInfer<TFilters>>,
  filters: TFilters,
  maxLength?: number,
): string {
  if (maxLength !== undefined && maxLength < 0) {
    throw new RangeError("maxLength must not be negative");
  }
  if (maxLength === 0) return "";

  const shortText = getFilterTextParts(config, filters, "shortText")
    .map(({ label, text }) => (label === undefined ? text : `${label} ${text}`))
    .join(" + ");
  return maxLength !== undefined && shortText.length > maxLength
    ? `${shortText.slice(0, maxLength - 1)}…`
    : shortText;
}

/**
 * Returns text parts for defined filters in config order, omitting `null` results.
 * @param form Use `"shortText"` for the short form; otherwise use `"text"`.
 */
export function getFilterTextParts<TFilters extends object>(
  config: FilterRepresentationConfig<NoInfer<TFilters>>,
  filters: TFilters,
  form: "text" | "shortText" = "text",
): FilterTextPart<TFilters>[] {
  const parts: FilterTextPart<TFilters>[] = [];

  for (const key of Object.keys(config) as (keyof TFilters & string)[]) {
    const value = filters[key];
    if (!isDefined(value)) continue;

    const entry = config[key];
    const formatter = entry[form] ?? entry.text;
    const text = formatter
      ? formatter(value, filters)
      : [entry.label, String(value)];
    if (text === null) continue;

    parts.push(
      typeof text === "string"
        ? { key, text }
        : { key, label: text[0], text: text[1] },
    );
  }

  return parts;
}

function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}
