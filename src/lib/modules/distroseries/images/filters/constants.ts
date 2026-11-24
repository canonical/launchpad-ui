import type { FilterRepresentationConfig } from "#lib/modules/filtering/representation.js";
import { PRODUCTS } from "../constants.js";
import type { ImagesFilters } from "./schema.js";

export const DEFAULT_IMAGES_FILTERS = {
  product: undefined,
  buildStatus: undefined,
  testStatus: undefined,
} as const satisfies ImagesFilters;

export const IMAGES_FILTER_REPRESENTATION = {
  product: {
    label: "Product",
    text: (slug) => ["Product", getProductName(slug)],
    shortText: (slug) => getProductName(slug),
  },
  buildStatus: {
    label: "Build status",
    text: (value) => ["Build status", capitalize(value)],
    shortText: (value) => `Build ${value}`,
  },
  testStatus: {
    label: "Test status",
    text: (value) => ["Test status", capitalize(value)],
    shortText: (value) => `Test ${value}`,
  },
} satisfies FilterRepresentationConfig<ImagesFilters>;

function getProductName(slug: string): string {
  return PRODUCTS.find((product) => product.slug === slug)?.name ?? slug;
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
