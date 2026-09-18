// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { strCodec, superhref } from "@canonical/superhref";
import { slugify } from "$lib/utils/index.js";
import { paginationCodecs } from "$lib/utils/paginationCodecs.js";
import { sortCodec } from "$lib/utils/sortCodec.js";

/** The packages table columns, in display order.*/
export const PACKAGES_TABLE_COLUMNS = [
  { key: "source-package", label: "Source package", sortable: true },
  { key: "series", label: "Series", sortable: true },
  { key: "pocket", label: "Pocket", sortable: true },
  { key: "binary-packages", label: "Binary packages", sortable: false },
  { key: "status", label: "Status", sortable: true },
] as const satisfies readonly {
  key: string;
  label: string;
  sortable: boolean;
}[];

export const SORTABLE_PACKAGES_COLUMNS = PACKAGES_TABLE_COLUMNS.flatMap(
  (column) => (column.sortable ? [column.key] : []),
);

// Temporary.
// TODO: Remove when values are served from the backend.
export const TABLE_VIEWS = [
  "All packages",
  "Signed by me",
  "Maintained by me",
].map((tab) => ({ name: tab, slug: slugify(tab) }));
export const DEFAULT_TABLE_VIEW = TABLE_VIEWS[0];

/**
 * Create constant for the superhref key only
 * if it is meant to be used in a place where you
 * cannot rely on types
 */
export const BINARY_PACKAGE_QUERY_PARAM = "binary-package";

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, MAX_PAGE_SIZE];

export const QueryParams = superhref(
  {
    [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
    sort: sortCodec(SORTABLE_PACKAGES_COLUMNS),
    view: strCodec({ default: DEFAULT_TABLE_VIEW.slug }),
    series: strCodec(), //TODO proper type when filters land
    ...paginationCodecs({
      defaultSize: DEFAULT_PAGE_SIZE,
      maxSize: MAX_PAGE_SIZE,
    }),
  },
  {
    actions: {
      setView: (patch, { sort }, view) => {
        const isDefaultView = view === DEFAULT_TABLE_VIEW.slug;
        return patch({
          view: isDefaultView ? null : view,
          sort: isDefaultView ? sort : null,
          page: 1,
        });
      },
    },
  },
);

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;

export type PackagesQueryParam = keyof ReturnType<typeof QueryParams.parse>;

export type PackagesQueryFormBindings = {
  preserveParams: [name: string, value: string][];
  onformdata: (event: Pick<FormDataEvent, "formData">) => void;
};

/**
 * Returns query entries to preserve and a `formdata` handler that normalizes
 * replacement values and clears listed parameters with no submitted field.
 */
export function createPackagesQueryForm(
  url: URL,
  replaceParams: readonly PackagesQueryParam[],
): PackagesQueryFormBindings {
  return {
    preserveParams: [...url.searchParams.entries()].filter(
      ([name]) => !replaceParams.some((key) => key === name),
    ),
    onformdata: ({ formData }) => {
      const submitted = new URL(url);
      submitted.search = String(new URLSearchParams(entriesOf(formData)));
      const queryParams = QueryParams.parse(submitted);
      const submittedParams = Object.fromEntries(
        replaceParams.map((key) => [
          key,
          formData.has(key) ? queryParams[key] : null,
        ]),
      ) as Parameters<typeof QueryParams.patch>[1];

      const patched = QueryParams.patch(url, submittedParams).searchParams;

      for (const parameterName of Object.keys(queryParams)) {
        const patcherParamValue = patched.getAll(parameterName);

        if (!formDataValuesMatch(formData, parameterName, patcherParamValue)) {
          replaceFormDataValues(formData, parameterName, patcherParamValue);
        }
      }
    },
  };
}

function formDataValuesMatch(
  formData: FormData,
  key: string,
  values: readonly string[],
): boolean {
  const currentValues = formData.getAll(key);
  return (
    values.length === currentValues.length &&
    values.every((value, index) => value === currentValues[index])
  );
}

function replaceFormDataValues(
  formData: FormData,
  key: string,
  values: readonly string[],
): void {
  const [first, ...remaining] = values;
  if (first === undefined) {
    formData.delete(key);
  } else {
    formData.set(key, first);
    for (const value of remaining) formData.append(key, value);
  }
}

function entriesOf(formData: FormData): [name: string, value: string][] {
  return Array.from(formData, ([name, value]) => [name, String(value)]);
}
