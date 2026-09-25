import type { Codec } from "@canonical/superhref";

export type PaginationCodecs = {
  page: Codec<number>;
  "page-size": Codec<number>;
};

export function paginationCodecs(opts: {
  defaultSize: number;
  maxSize: number;
}): PaginationCodecs {
  return {
    page: positiveIntCodec(1, Infinity),
    "page-size": positiveIntCodec(opts.defaultSize, opts.maxSize),
  };
}

function positiveIntCodec(defaultValue: number, max: number): Codec<number> {
  return {
    parse: (raw) => {
      const value = Number(raw);
      if (!Number.isInteger(value) || value < 1) return defaultValue;
      return Math.min(value, max);
    },
    serialize: (value) =>
      value === null || value === defaultValue ? null : String(value),
    default: defaultValue,
  };
}
