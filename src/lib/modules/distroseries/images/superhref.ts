import {
  
  enumCodec,
  strCodec,
  superhref
} from "@canonical/superhref";
import type {OwnedKey} from "@canonical/superhref";
import { paginationCodecs, sortCodec } from "$lib/codecs";
import {
  BUILD_STATUSES,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TABLE_VIEW_SLUG,
  MANAGE_VIEWS_PANEL,
  MAX_PAGE_SIZE,
  PRODUCTS,
  SORTABLE_IMAGES_TABLE_COLUMNS,
  TEST_STATUSES,
} from "./constants";

const imagesQuerySchema = {
  panel: enumCodec([MANAGE_VIEWS_PANEL]),
  view: strCodec({ default: DEFAULT_TABLE_VIEW_SLUG }),
  product: enumCodec(PRODUCTS.map((product) => product.slug)),
  "build-status": enumCodec(BUILD_STATUSES),
  "test-status": enumCodec(TEST_STATUSES),
  sort: sortCodec(SORTABLE_IMAGES_TABLE_COLUMNS),
  ...paginationCodecs({
    defaultSize: DEFAULT_PAGE_SIZE,
    maxSize: MAX_PAGE_SIZE,
  }),
};

export const QueryParams = superhref(imagesQuerySchema, {
  actions: {
    setView: (patch, _, view) => {
      const isDefaultView = view === DEFAULT_TABLE_VIEW_SLUG;
      return patch({
        sort: null,
        view: isDefaultView ? null : view,
        page: 1,
      });
    },
  },
});

export type ImageOwnedQueryKey = OwnedKey<typeof imagesQuerySchema>;
