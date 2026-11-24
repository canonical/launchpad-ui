import { describe, expect, it } from "vitest";
import { getFilterTextParts, getShortFilterText } from "./representation.js";

describe("getFilterTextParts turns active filter values into display parts", () => {
  describe("Orders and selects active filters", () => {
    it("returns parts in the order keys appear in the config", () => {
      const parts = getFilterTextParts(
        {
          first: { label: "First" },
          second: { label: "Second" },
          third: { label: "Third" },
        },
        { third: "3", first: "1", second: "2" },
      );

      expect(parts.map((part) => part.key)).toEqual([
        "first",
        "second",
        "third",
      ]);
    });

    it("omits filters whose value is undefined", () => {
      const parts = getFilterTextParts(
        {
          a: { label: "A" },
          b: { label: "B" },
        },
        { a: undefined, b: "present" },
      );

      expect(parts).toEqual([{ key: "b", label: "B", text: "present" }]);
    });

    it("keeps defined falsy and empty values", () => {
      const parts = getFilterTextParts(
        {
          text: { label: "Text" },
          count: { label: "Count" },
          enabled: { label: "Enabled" },
          tags: { label: "Tags" },
          nullable: { label: "Nullable" },
        },
        {
          text: "",
          count: 0,
          enabled: false,
          tags: [],
          nullable: null,
        },
      );

      expect(parts).toEqual([
        { key: "text", label: "Text", text: "" },
        { key: "count", label: "Count", text: "0" },
        { key: "enabled", label: "Enabled", text: "false" },
        { key: "tags", label: "Tags", text: "" },
        { key: "nullable", label: "Nullable", text: "null" },
      ]);
    });
  });

  describe("Formats values in the default text mode", () => {
    it("falls back to [label, String(value)] when no text formatter is provided", () => {
      const createdAt = new Date("2026-01-02T03:04:05.000Z");

      const parts = getFilterTextParts(
        {
          count: { label: "Count" },
          enabled: { label: "Enabled" },
          tags: { label: "Tags" },
          createdAt: { label: "Created" },
        },
        {
          count: 20,
          enabled: true,
          tags: ["arm64", "amd64"],
          createdAt,
        },
      );

      expect(parts).toEqual([
        { key: "count", label: "Count", text: "20" },
        { key: "enabled", label: "Enabled", text: "true" },
        { key: "tags", label: "Tags", text: "arm64,amd64" },
        { key: "createdAt", label: "Created", text: String(createdAt) },
      ]);
    });

    it("formats parts with a custom text formatter returning plain text or a [label, text] pair", () => {
      const parts = getFilterTextParts(
        {
          plain: { label: "Plain", text: (value) => `"${value}"` },
          labeled: {
            label: "Labeled",
            text: (value) => ["Custom", value.toUpperCase()],
          },
        },
        { plain: "hello", labeled: "world" },
      );

      expect(parts).toEqual([
        { key: "plain", text: '"hello"' },
        { key: "labeled", label: "Custom", text: "WORLD" },
      ]);
    });

    it("passes all filter values to the text formatter so one filter can depend on another", () => {
      const parts = getFilterTextParts(
        {
          mode: { label: "Mode", text: () => null },
          search: {
            label: "Search",
            text: (value, { mode }) => [mode, value],
          },
        },
        { mode: "Exact", search: "foo" },
      );

      expect(parts).toEqual([{ key: "search", label: "Exact", text: "foo" }]);
    });

    it("omits a filter when its text formatter returns null", () => {
      const parts = getFilterTextParts(
        {
          hidden: { label: "Hidden", text: () => null },
          visible: { label: "Visible" },
        },
        { hidden: "ignored", visible: "shown" },
      );

      expect(parts).toEqual([
        { key: "visible", label: "Visible", text: "shown" },
      ]);
    });
  });

  describe("Supports shortText formatting mode", () => {
    it("uses the shortText formatter when provided", () => {
      const parts = getFilterTextParts(
        {
          a: {
            label: "A",
            text: (value) => `long:${value}`,
            shortText: (value) => `short:${value}`,
          },
        },
        { a: "1" },
        "shortText",
      );

      expect(parts).toEqual([{ key: "a", text: "short:1" }]);
    });

    it("falls back to the text formatter when shortText is not provided", () => {
      const parts = getFilterTextParts(
        {
          custom: { label: "Custom", text: (value) => `text:${value}` },
          defaulted: { label: "Defaulted" },
        },
        { custom: "1", defaulted: "2" },
        "shortText",
      );

      expect(parts).toEqual([
        { key: "custom", text: "text:1" },
        { key: "defaulted", label: "Defaulted", text: "2" },
      ]);
    });

    it("omits a filter when shortText returns null without falling back to text", () => {
      const parts = getFilterTextParts(
        {
          hidden: {
            label: "Hidden",
            text: (value) => `text:${value}`,
            shortText: () => null,
          },
          visible: { label: "Visible" },
        },
        { hidden: "1", visible: "2" },
        "shortText",
      );

      expect(parts).toEqual([{ key: "visible", label: "Visible", text: "2" }]);
    });
  });
});

describe("getShortFilterText combines active filter values into a short string", () => {
  describe("Formats and joins parts", () => {
    it('joins short parts with " + " and separates labels from text with a space', () => {
      const result = getShortFilterText(
        {
          plain: { label: "Plain", shortText: (value) => value },
          labeled: { label: "Status" },
        },
        { plain: "hello", labeled: "open" },
      );

      expect(result).toBe("hello + Status open");
    });

    it("returns an empty string when no filters are active", () => {
      const result = getShortFilterText(
        { a: { label: "A" } },
        { a: undefined },
      );

      expect(result).toBe("");
    });

    it("uses shortText even when the filter's text formatter returns null", () => {
      const result = getShortFilterText(
        {
          a: {
            label: "A",
            text: () => null,
            shortText: (value) => value,
          },
        },
        { a: "short" },
      );

      expect(result).toBe("short");
    });

    it("omits a filter when its shortText formatter returns null", () => {
      const result = getShortFilterText(
        {
          hidden: { label: "Hidden", shortText: () => null },
          visible: { label: "Visible", shortText: (value) => value },
        },
        { hidden: "skip", visible: "keep" },
      );

      expect(result).toBe("keep");
    });
  });

  describe("Truncates when maxLength is provided", () => {
    it("does not truncate when maxLength is omitted", () => {
      const value = "a".repeat(200);

      const result = getShortFilterText(
        { a: { label: "A", shortText: (v) => v } },
        { a: value },
      );

      expect(result).toBe(value);
    });

    it.each([
      { maxLength: 0, expected: "" },
      { maxLength: 1, expected: "…" },
      { maxLength: 12, expected: "hello + wor…" },
      { maxLength: 13, expected: "hello + world" },
      { maxLength: 14, expected: "hello + world" },
    ])(
      "applies maxLength ($maxLength) to the joined text, counting the ellipsis",
      ({ maxLength, expected }) => {
        const result = getShortFilterText(
          {
            a: { label: "A", shortText: (value) => value },
            b: { label: "B", shortText: (value) => value },
          },
          { a: "hello", b: "world" },
          maxLength,
        );

        expect(result).toBe(expected);
      },
    );

    it("rejects a negative maxLength with a RangeError", () => {
      expect(() =>
        getShortFilterText({ a: { label: "A" } }, { a: undefined }, -10),
      ).toThrow(RangeError);
    });
  });
});
