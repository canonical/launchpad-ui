type FilterText = string | readonly [label: string, text: string];

/**
 * Turns a set filter's value into text.
 *
 * @param value The filter's value.
 * @param filters All filter values, for text that depends on another filter.
 * @returns Plain text, a `[label, text]` pair, or `null` to leave the filter out.
 */
type FilterTextFn<TValue, TFilters> = (
  value: TValue,
  filters: TFilters,
) => FilterText | null;

/** How one filter is turned into text. */
type FilterEntry<TValue, TFilters> = {
  /** The filter's name, such as `"Series"`. Also usable as its form field label. */
  label: string;
  /**
   * The full text, as shown in the filter summary.
   *
   * @default (value) => [label, String(value)]
   * @example (enabled) => (enabled ? "All statuses" : null)
   * @example (search, { match }) => [match === "exact" ? "Is" : "Contains", `"${search}"`]
   */
  text?: FilterTextFn<TValue, TFilters>;
  /**
   * A shorter form of {@link FilterEntry.text | text}, for where space is tight,
   * such as suggested view names. Returning `null` leaves the filter out of the
   * short form only.
   *
   * @default text
   * @example (series) => series
   */
  shortText?: FilterTextFn<TValue, TFilters>;
};

/**
 * How each filter is turned into text. Key order sets the display order.
 * Unset filters (i.e., those with the value `undefined`) are always left out.
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
  /** Shown before {@link FilterTextPart.text | text}, as in `Series: noble`. Missing when the filter's text is plain text. */
  label?: string;
  /** The text after {@link FilterTextPart.label | label}, or all of the text when there is no label. */
  text: string;
};

/**
 * Joins the short form of each filter with `" + "`, as in `noble + Maintained by jdoe`.
 * A label and its text are joined with a space.
 * @param maxLength Optional character limit. Longer text is cut and ends with `…`, which counts towards the limit.
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
 * Returns a text part for each filter, in config order. Leaves out filters that
 * are `undefined` or whose text is `null`.
 * @param form Which text to use. `"shortText"` falls back to `text` for filters without one.
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
