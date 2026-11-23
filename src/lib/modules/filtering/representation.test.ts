import { describe, expect, it } from "vitest";
import { getFilterTextParts, getShortFilterText } from "./representation.js";
import type { FilterRepresentationConfig } from "./representation.js";

type ImageFilters = {
  keyword: string | undefined;
  series: "noble" | "jammy" | undefined;
  pageSize: number | undefined;
  daily: boolean | undefined;
  tags: string[] | undefined;
  nullable: string | null | undefined;
  createdAt: Date | undefined;
  optional?: string;
};

const config = {
  keyword: {
    label: "Keyword",
    text: (keyword, { series }) => [series ?? "Any series", keyword],
    shortText: (keyword) => `"${keyword}"`,
  },
  series: {
    label: "Series",
    text: (series) => ["Series", series.toUpperCase()],
    shortText: (series) => series.toUpperCase(),
  },
  pageSize: { label: "Page size" },
  daily: { label: "Daily builds" },
  tags: { label: "Tags" },
  nullable: { label: "Nullable" },
  createdAt: { label: "Created" },
  optional: { label: "Optional" },
} satisfies FilterRepresentationConfig<ImageFilters>;

const empty: ImageFilters = {
  keyword: undefined,
  series: undefined,
  pageSize: undefined,
  daily: undefined,
  tags: undefined,
  nullable: undefined,
  createdAt: undefined,
  optional: undefined,
};

describe("getFilterTextParts", () => {
  it("uses config order and formats values with shared defaults", () => {
    const filters: ImageFilters = {
      ...empty,
      keyword: "server",
      series: "noble",
      pageSize: 20,
      daily: true,
      tags: ["arm64", "amd64"],
      createdAt: new Date("2026-01-02T03:04:05.000Z"),
    };

    expect(getFilterTextParts<ImageFilters>(config, filters)).toEqual([
      { key: "keyword", label: "noble", text: "server" },
      { key: "series", label: "Series", text: "NOBLE" },
      { key: "pageSize", label: "Page size", text: "20" },
      { key: "daily", label: "Daily builds", text: "true" },
      { key: "tags", label: "Tags", text: "arm64,amd64" },
      {
        key: "createdAt",
        label: "Created",
        text: String(filters.createdAt),
      },
    ]);
  });

  it("skips only undefined values", () => {
    const filters: ImageFilters = {
      ...empty,
      keyword: "",
      pageSize: 0,
      daily: false,
      tags: [],
      optional: "",
      nullable: null,
    };

    expect(getFilterTextParts<ImageFilters>(config, filters)).toEqual([
      { key: "keyword", label: "Any series", text: "" },
      { key: "pageSize", label: "Page size", text: "0" },
      { key: "daily", label: "Daily builds", text: "false" },
      { key: "tags", label: "Tags", text: "" },
      { key: "nullable", label: "Nullable", text: "null" },
      { key: "optional", label: "Optional", text: "" },
    ]);
  });

  it("allows text callbacks to read other filters and return null", () => {
    const filters: ImageFilters = {
      ...empty,
      keyword: "server",
      series: "jammy",
    };

    expect(getFilterTextParts<ImageFilters>(config, filters)[0]).toEqual({
      key: "keyword",
      label: "jammy",
      text: "server",
    });

    const hiddenConfig = {
      ...config,
      keyword: { ...config.keyword, text: () => null },
    } satisfies FilterRepresentationConfig<ImageFilters>;

    expect(getFilterTextParts<ImageFilters>(hiddenConfig, filters)).toEqual([
      { key: "series", label: "Series", text: "JAMMY" },
    ]);
  });

  it("returns short parts, falling back to text only when shortText is absent", () => {
    const shortConfig = {
      ...config,
      series: { label: "Series", text: config.series.text },
      daily: { label: "Daily builds", shortText: () => null },
    } satisfies FilterRepresentationConfig<ImageFilters>;
    const filters: ImageFilters = {
      ...empty,
      keyword: "server",
      series: "noble",
      daily: true,
    };

    expect(getFilterTextParts(shortConfig, filters, "shortText")).toEqual([
      { key: "keyword", text: '"server"' },
      { key: "series", label: "Series", text: "NOBLE" },
    ]);
  });
});

describe("getShortFilterText", () => {
  it("joins shortText callbacks' results or their text fallbacks", () => {
    const filters: ImageFilters = {
      ...empty,
      keyword: "server",
      series: "noble",
      pageSize: 0,
    };

    expect(getShortFilterText<ImageFilters>(config, filters)).toBe(
      '"server" + NOBLE + Page size 0',
    );
    expect(getShortFilterText<ImageFilters>(config, empty)).toBe("");

    const hiddenTextConfig = {
      ...config,
      keyword: { ...config.keyword, text: () => null },
    } satisfies FilterRepresentationConfig<ImageFilters>;

    expect(getShortFilterText<ImageFilters>(hiddenTextConfig, filters)).toBe(
      '"server" + NOBLE + Page size 0',
    );

    const hiddenShortTextConfig = {
      ...config,
      keyword: { ...config.keyword, shortText: () => null },
    } satisfies FilterRepresentationConfig<ImageFilters>;

    expect(
      getShortFilterText<ImageFilters>(hiddenShortTextConfig, filters),
    ).toBe("NOBLE + Page size 0");
  });

  it("does not truncate short text without a maximum length", () => {
    const keyword = "a".repeat(200);

    expect(getShortFilterText(config, { ...empty, keyword })).toBe(
      `"${keyword}"`,
    );
  });

  it.each([
    { maxLength: 0, expected: "" },
    { maxLength: 1, expected: "…" },
    { maxLength: 12, expected: '"aaa" + NOB…' },
    { maxLength: 13, expected: '"aaa" + NOBLE' },
    { maxLength: 14, expected: '"aaa" + NOBLE' },
  ])(
    "applies the supplied limit ($maxLength) to the joined text, including the ellipsis",
    ({ maxLength, expected }) => {
      const filters: ImageFilters = {
        ...empty,
        keyword: "aaa",
        series: "noble",
      };

      expect(getShortFilterText(config, filters, maxLength)).toBe(expected);
    },
  );

  it("rejects a negative maximum length", () => {
    expect(() => getShortFilterText(config, empty, -10)).toThrow(RangeError);
  });
});
