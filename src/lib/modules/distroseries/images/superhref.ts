import {
  enumCodec,
  strCodec,
  superhref,
  withActions,
} from "@canonical/superhref";
import type { OwnedKey } from "@canonical/superhref";
import { paginationCodecs, sortCodec } from "$lib/codecs";
import {
  BUILD_STATUSES,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PRODUCTS,
  SORTABLE_IMAGES_TABLE_COLUMNS,
  TEST_STATUSES,
} from "./constants";
import { DEFAULT_TABLE_VIEW_SLUG } from "./table-views/constants";

export const PANEL_QUERY_PARAM = "panel";
export const MANAGE_VIEWS_PANEL = "manage-views";

const imagesQuerySchema = {
  [MANAGE_VIEWS_PANEL]: {
    edit: strCodec({}),
  },
  [PANEL_QUERY_PARAM]: enumCodec([MANAGE_VIEWS_PANEL]),
  images: withActions(
    {
      view: strCodec({ default: DEFAULT_TABLE_VIEW_SLUG }),
      product: enumCodec(PRODUCTS.map((product) => product.slug)),
      "build-status": enumCodec(BUILD_STATUSES),
      "test-status": enumCodec(TEST_STATUSES),
      sort: sortCodec(SORTABLE_IMAGES_TABLE_COLUMNS),
      ...paginationCodecs({
        defaultSize: DEFAULT_PAGE_SIZE,
        maxSize: MAX_PAGE_SIZE,
      }),
    },
    {
      setView: (patch, _, view) => {
        const isDefaultView = view === DEFAULT_TABLE_VIEW_SLUG;
        return patch({
          sort: null,
          view: isDefaultView ? null : view,
          page: 1,
        });
      },
    },
  ),
};

export const QueryParams = superhref(imagesQuerySchema);

export type ImageOwnedQueryKey = OwnedKey<typeof imagesQuerySchema>;
