import * as v from "valibot";
import { MAX_BINARY_NAMES } from "$lib/modules/packages/constants.js";
import { launchpadFetch } from "./launchpadFetch.js";
import {
  binaryPackageDetailsSchema,
  sourcePackageListSchema,
} from "./types.js";
import type {
  BinaryPackageDetails,
  Collection,
  DistroSeriesEntry,
  MilestoneEntry,
  PersonEntry,
  SourcePackageList,
  SourcePackageListFilter,
  SourcePackageListQuery,
} from "./types.js";
import { env } from "$env/dynamic/private";

export class LaunchpadApiError extends Error {
  constructor(
    public readonly status: number,
    url: string,
  ) {
    super(`Launchpad request to ${url} failed with status ${status}`);
    this.name = "LaunchpadApiError";
  }
}

type QueryParamValue = string | number | null | undefined;
type QueryParams = Record<string, QueryParamValue | QueryParamValue[]>;

const MAX_REDIRECTS = 5;

export function getDistroSeries(
  distro: string,
  series: string,
): Promise<DistroSeriesEntry> {
  return getJson(seriesUrl(distro, series));
}

export function getDistroSeriesCollection(
  distro: string,
): Promise<Collection<DistroSeriesEntry>> {
  return getJson(`${apiBase()}/${encodeURIComponent(distro)}/series`);
}

export function getActiveSeriesMilestones(
  distro: string,
  series: string,
): Promise<Collection<MilestoneEntry>> {
  return getJson(
    `${seriesUrl(distro, series)}?${searchParams({
      "ws.op": "searchMilestones",
      is_active: "true",
      order_by: "date_targeted",
      "ws.size": 3,
    })}`,
  );
}

export async function getSourcePackageList(
  distro: string,
  query: SourcePackageListQuery,
): Promise<SourcePackageList> {
  const result = await getJson(
    archiveUrl(distro, "getSourcePackageList", {
      page_size: query.size,
      page: query.page,
      order_by: query.orderBy ? JSON.stringify(query.orderBy) : undefined,
      include_binaries: "true",
      binary_names_limit: MAX_BINARY_NAMES,
      ...sourcePackagesFilterParams(distro, query),
    }),
  );
  return v.parse(sourcePackageListSchema, result);
}

export async function getBinaryPackageDetails(
  distro: string,
  binaryId: number,
): Promise<BinaryPackageDetails> {
  const result = await getJson(
    archiveUrl(distro, "getBinaryPackageDetails", { binary_id: binaryId }),
  );
  return v.parse(binaryPackageDetailsSchema, result);
}

export function findPeople(text: string): Promise<Collection<PersonEntry>> {
  return getJson(
    `${apiBase()}/people?${searchParams({
      "ws.op": "find",
      text,
    })}`,
  );
}

export async function getPerson(name: string): Promise<PersonEntry | null> {
  const url = personLink(name);
  const { response } = await fetchFollowingRedirects(url, {
    headers: { accept: "application/json" },
  });
  if (response.status === 404 || response.status === 410) {
    return null;
  }
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
}

export async function fetchFollowingRedirects(
  url: string,
  init: RequestInit,
  fetcher: typeof launchpadFetch = launchpadFetch,
): Promise<{ url: string; response: Response }> {
  let currentUrl = url;
  let response = await fetcher(currentUrl, init);
  for (let redirects = 0; redirects < MAX_REDIRECTS; redirects++) {
    const location = response.headers.get("location");
    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect || location === null) {
      break;
    }
    await response.body?.cancel();
    currentUrl = new URL(location, currentUrl).toString();
    response = await fetcher(currentUrl, init);
  }
  return { url: currentUrl, response };
}

async function getJson<T>(url: string): Promise<T> {
  const response = await launchpadFetch(url, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
}

function sourcePackagesFilterParams(
  distro: string,
  filter: SourcePackageListFilter,
): QueryParams {
  return {
    status: filter.statuses ? JSON.stringify(filter.statuses) : undefined,
    distro_series: filter.series
      ? `${apiBase()}/${encodeURIComponent(distro)}/${encodeURIComponent(filter.series)}`
      : undefined,
    name: filter.sourceName || undefined,
    exact_match: filter.sourceName
      ? String(filter.exactMatch ?? false)
      : undefined,
    pocket: filter.pocket,
    maintained_by: filter.maintainedBy
      ? personLink(filter.maintainedBy)
      : undefined,
    signed_by: filter.signedBy ? personLink(filter.signedBy) : undefined,
    ubuntu_change: filter.ubuntuChange ? "true" : undefined,
  };
}

function archiveUrl(
  distro: string,
  operation: string,
  params: QueryParams,
): string {
  return distroUrl(distro, "+archive/primary", {
    "ws.op": operation,
    ...params,
  });
}

function distroUrl(
  distro: string,
  resource: string,
  params: QueryParams,
): string {
  return `${apiBase()}/${encodeURIComponent(distro)}/${resource}?${searchParams(params)}`;
}

function searchParams(params: QueryParams): URLSearchParams {
  const search = new URLSearchParams();
  for (const [name, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item != null) {
        search.append(name, String(item));
      }
    }
  }
  return search;
}

function personLink(name: string): string {
  return `${apiBase()}/~${encodeURIComponent(name)}`;
}

function seriesUrl(distro: string, series: string): string {
  return `${apiBase()}/${encodeURIComponent(distro)}/${encodeURIComponent(series)}`;
}

function apiBase(): string {
  const host = env.MAIN_LAUNCHPAD_BASE_HOST;
  if (!host) {
    throw new Error("MAIN_LAUNCHPAD_BASE_HOST is not set");
  }
  return new URL("/api/devel", host).toString();
}
