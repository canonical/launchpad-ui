import { http, HttpResponse } from "msw";
import type {
  Component,
  Pocket,
  PublishingStatus,
  SortOrder,
  SourcePackagesTab,
} from "../../types.js";
import {
  asArray,
  matchesFilter,
  matchesSearch,
  paginate,
} from "./helpers/list.js";
import { toListingItem } from "../data/converters.js";
import {
  SOURCE_PACKAGES,
  SOURCE_PACKAGE_NAMES,
} from "../data/seeds/index.js";
import { SERIES } from "../data/series.js";
import { PACKAGES_API } from "./helpers/paths.js";
import {
  parseQuery,
  readFilterField,
  readListingSize,
  readNumber,
  readString,
} from "./helpers/query.js";
import { badRequestResponse } from "./helpers/responses.js";
import { safeWrap } from "./helpers/wrap.js";

const SORT_COLUMNS = [
  "name",
  "latest-version",
  "latest-uploaded",
  "section",
  "uploadDate", // alias for "latest-uploaded"
] as const;
type SortColumn = (typeof SORT_COLUMNS)[number];

const SORT_ORDERS: SortOrder[] = ["asc", "desc"];

const TAB_VALUES: SourcePackagesTab[] = [
  "all",
  "my-uploads",
  "latest-uploads",
  "ubuntu-server",
];

const UBUNTU_SERVER_SECTIONS = new Set<string>([
  "admin",
  "database",
  "devel",
  "httpd",
  "interpreters",
  "kernel",
  "mail",
  "net",
  "shells",
  "web",
]);

const LATEST_UPLOADS_LIMIT = 15;
const SCOPE_MY_PACKAGE_LIMIT = 3;

const myUploadsNames = (): string[] =>
  SOURCE_PACKAGE_NAMES.slice(0, SCOPE_MY_PACKAGE_LIMIT);

const latestUploadedAt = (name: string): string =>
  SOURCE_PACKAGES[name]?.versions[0]?.uploadDateTime ?? "";

const latestUploadsNames = (candidates: string[]): string[] =>
  [...candidates]
    .sort((a, b) => {
      const da = latestUploadedAt(a);
      const db = latestUploadedAt(b);
      if (da === db) return 0;
      return da < db ? 1 : -1;
    })
    .slice(0, LATEST_UPLOADS_LIMIT);

const ubuntuServerNames = (candidates: string[]): string[] =>
  candidates.filter((name) => {
    const seed = SOURCE_PACKAGES[name];
    if (!seed) return false;
    return seed.versions.some((v) => UBUNTU_SERVER_SECTIONS.has(v.section));
  });

const namesForTab = (
  tab: SourcePackagesTab,
  candidates: string[],
): string[] => {
  switch (tab) {
    case "my-uploads":
      return myUploadsNames();
    case "latest-uploads":
      return latestUploadsNames(candidates);
    case "ubuntu-server":
      return ubuntuServerNames(candidates);
    case "all":
    default:
      return candidates;
  }
};

type ListingScope = "all" | "my";

const buildListing = (
  queryParams: Record<string, unknown>,
  scope: ListingScope,
): Response => {
  const tabRaw = readString(queryParams.tab);
  if (
    tabRaw !== undefined &&
    !TAB_VALUES.includes(tabRaw as SourcePackagesTab)
  ) {
    return badRequestResponse(
      `Invalid tab "${tabRaw}" (expected one of ${TAB_VALUES.join(", ")})`,
    );
  }
  const tab = (tabRaw as SourcePackagesTab | undefined) ?? "all";

  const sortRaw = readString(queryParams.sort);
  if (sortRaw !== undefined) {
    const stripped = sortRaw.replace(/^[-+]/, "");
    if (!SORT_COLUMNS.includes(stripped as SortColumn)) {
      return badRequestResponse(
        `Invalid sort column "${stripped}" (expected one of ${SORT_COLUMNS.join(", ")})`,
      );
    }
  }

  const orderRaw = readString(queryParams.order);
  if (orderRaw !== undefined && !SORT_ORDERS.includes(orderRaw as SortOrder)) {
    return badRequestResponse(
      `Invalid order "${orderRaw}" (expected ${SORT_ORDERS.join(" or ")})`,
    );
  }

  const scopeFilterRaw = readString(readFilterField(queryParams, "scope"));
  if (
    scopeFilterRaw !== undefined &&
    scopeFilterRaw !== "all" &&
    scopeFilterRaw !== "my"
  ) {
    return badRequestResponse(
      `Invalid filter.scope "${scopeFilterRaw}" (expected "all" or "my")`,
    );
  }

  const search =
    readString(queryParams.search) ?? readString(queryParams.q);
  const statusFilter = readFilterField(queryParams, "status") as
    | PublishingStatus
    | PublishingStatus[]
    | undefined;
  const seriesFilter = readFilterField(queryParams, "series");
  const pocketFilter = readFilterField(queryParams, "pocket") as
    | Pocket
    | Pocket[]
    | undefined;
  const componentFilter = readFilterField(queryParams, "component") as
    | Component
    | Component[]
    | undefined;
  const sectionFilter = readFilterField(queryParams, "section");
  // accepted but unused — no team data in the seed yet.
  void readFilterField(queryParams, "team");

  const effectiveScope: ListingScope =
    scope === "my" || scopeFilterRaw === "my" || tab === "my-uploads"
      ? "my"
      : "all";

  const baseNames =
    effectiveScope === "my" ? myUploadsNames() : SOURCE_PACKAGE_NAMES;
  const tabbedNames = namesForTab(tab, baseNames);

  const allowedSeries = asArray(seriesFilter);
  const enriched = tabbedNames
    .map((name) => SOURCE_PACKAGES[name])
    .filter((seed): seed is NonNullable<typeof seed> => seed !== undefined)
    .map((seed) => {
      const matchedVersion =
        allowedSeries.length > 0
          ? seed.versions.find((v) => allowedSeries.includes(v.series))
          : undefined;
      const baseItem = toListingItem(seed);
      const item = matchedVersion
        ? {
            ...baseItem,
            series: SERIES[matchedVersion.series],
            pocket: matchedVersion.pocket,
            component: matchedVersion.component,
          }
        : baseItem;
      return {
        seed,
        item,
        matchedVersion,
        uploadDateTime: seed.versions[0]?.uploadDateTime ?? "",
        section: seed.versions[0]?.section ?? "",
      };
    });

  const filtered = enriched.filter(({ seed, item, matchedVersion }) => {
    if (allowedSeries.length > 0 && !matchedVersion) return false;
    if (sectionFilter !== undefined) {
      const allowed = asArray(sectionFilter);
      if (
        allowed.length > 0 &&
        !seed.versions.some((v) => allowed.includes(v.section))
      ) {
        return false;
      }
    }
    return (
      matchesSearch(search, [
        seed.details.name,
        seed.details.maintainer.name,
        ...seed.binaryPackageNames,
      ]) &&
      matchesFilter(item.status, statusFilter) &&
      matchesFilter(item.pocket, pocketFilter) &&
      matchesFilter(item.component, componentFilter)
    );
  });

  type EnrichedRow = (typeof enriched)[number];
  const sortKey = (row: EnrichedRow, field: string) => {
    if (field === "name") return row.item.sourcePackage.name;
    if (field === "latest-version") return row.item.sourcePackage.latestVersion;
    if (field === "latest-uploaded") return row.uploadDateTime;
    if (field === "uploadDate") return row.uploadDateTime;
    if (field === "section") return row.section;
    return undefined;
  };

  const defaultSort = "-latest-uploaded";
  const sort = sortRaw ?? defaultSort;
  const order = (orderRaw as SortOrder | undefined) ?? "asc";
  const size = readListingSize(queryParams.size);
  const page = readNumber(queryParams.page);

  const paginated = paginate(filtered, { sort, order, page, size }, sortKey);

  return HttpResponse.json({
    items: paginated.items.map((row) => row.item),
    total: paginated.total,
    page: paginated.page,
    size: paginated.size,
  });
};

export const sourcePackagesHandlers = [
  http.get(
    `${PACKAGES_API}/source-packages`,
    safeWrap(({ request }) =>
      buildListing(parseQuery(new URL(request.url)), "all"),
    ),
  ),

  http.get(
    `${PACKAGES_API}/me/source-packages`,
    safeWrap(({ request }) =>
      buildListing(parseQuery(new URL(request.url)), "my"),
    ),
  ),
];
