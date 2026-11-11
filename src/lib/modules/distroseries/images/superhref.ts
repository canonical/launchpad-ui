import {
  enumCodec,
  strCodec,
  superhref,
  withActions,
} from "@canonical/superhref";
import type { OwnedKey, SuperhrefPatchInput } from "@canonical/superhref";
import { paginationCodecs, sortCodec } from "#lib/codecs/index.ts";
import { ADD_TABLE_VIEW_MODES } from "#lib/modules/table-views/constants.ts";
import type { AddTableViewMode } from "#lib/modules/table-views/constants.ts";
import { DEFAULT_PAGE_SIZE } from "#lib/schemas/index.ts";
import {
  BUILD_STATUSES,
  MAX_PAGE_SIZE,
  PRODUCTS,
  SORTABLE_IMAGES_TABLE_COLUMNS,
  TEST_STATUSES,
} from "./constants";
import type { ImagesFilters } from "./filters/schema";
import { DEFAULT_TABLE_VIEW_SLUG } from "./table-views/constants";

export const PANEL_QUERY_PARAM = "panel";
export const MANAGE_VIEWS_PANEL = "manage-views";

const imagesQuerySchema = {
  [MANAGE_VIEWS_PANEL]: withActions(
    {
      edit: strCodec(),
      add: enumCodec(ADD_TABLE_VIEW_MODES),
    },
    {
      closeForm: (patch) => {
        return patch({ edit: null, add: null });
      },
    },
  ),
  [PANEL_QUERY_PARAM]: enumCodec([MANAGE_VIEWS_PANEL]),
  images: {
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
};

export const QueryParams = superhref(imagesQuerySchema, {
  actions: {
    setView: (patch, _, view) => {
      return patch({
        images: {
          view: view === DEFAULT_TABLE_VIEW_SLUG ? null : view,
          page: 1,
        },
      });
    },
    editView: (patch, _, viewId: string) => {
      return patch({
        [PANEL_QUERY_PARAM]: MANAGE_VIEWS_PANEL,
        [MANAGE_VIEWS_PANEL]: { edit: viewId, add: null },
      });
    },
    addView: (patch, _, addMode: AddTableViewMode) => {
      return patch({
        [PANEL_QUERY_PARAM]: MANAGE_VIEWS_PANEL,
        [MANAGE_VIEWS_PANEL]: { add: addMode, edit: null },
      });
    },
  },
});

export type ImageOwnedQueryKey = OwnedKey<typeof imagesQuerySchema>;
export type BoundImagesQueryParams = ReturnType<typeof QueryParams.bind>;

export const CLEARED_FILTER_PARAMS = {
  images: {
    product: null,
    "build-status": null,
    "test-status": null,
  },
} as const satisfies SuperhrefPatchInput<typeof imagesQuerySchema>;

export function toImagesFilters(
  queryParams: BoundImagesQueryParams,
): ImagesFilters {
  return {
    product: queryParams.images.product,
    testStatus: queryParams.images["test-status"],
    buildStatus: queryParams.images["build-status"],
  };
}
