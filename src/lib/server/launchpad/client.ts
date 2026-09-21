import { launchpadFetch } from "./launchpadFetch.js";
import type {
  Collection,
  PersonEntry,
  PublishedSourcesFilter,
  PublishedSourcesQuery,
  SourcePackagePublishingEntry,
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

export function getPublishedSources(
  distro: string,
  query: PublishedSourcesQuery,
): Promise<Collection<SourcePackagePublishingEntry>> {
  return getJson(
    archiveUrl(distro, "getPublishedSources", {
      "ws.size": query.size,
      "ws.start": query.start,
      order_by: query.orderBy,
      ...sourcePackagesFilterParams(distro, query),
    }),
  );
}

export async function getPublishedSourcesTotal(
  distro: string,
  filter: PublishedSourcesFilter,
): Promise<number> {
  const url = archiveUrl(distro, "getPublishedSources", {
    "ws.show": "total_size",
    ...sourcePackagesFilterParams(distro, filter),
  });
  const total: unknown = await getJson(url);
  if (typeof total !== "number") {
    throw new Error(`Launchpad request to ${url} did not return a total`);
  }
  return total;
}

export function findPeople(
  text: string,
  page: { size: number; start: number },
): Promise<Collection<PersonEntry>> {
  return getJson(
    `${apiBase()}/people?${searchParams({
      "ws.op": "find",
      text,
      "ws.size": page.size,
      "ws.start": page.start,
    })}`,
  );
}

export async function getPerson(name: string): Promise<PersonEntry | null> {
  const url = personLink(name);
  const response = await fetchFollowingRedirects(url, {
    accept: "application/json",
  });
  if (response.status === 404 || response.status === 410) {
    return null;
  }
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
}

export async function getCurrentPerson(
  sessionCookie: string,
): Promise<PersonEntry | null> {
  const url = `${apiBase()}/people/+me`;
  const response = await fetchFollowingRedirects(url, {
    accept: "application/json",
    cookie: `${cookieName()}=${sessionCookie}`,
  });
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
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

async function fetchFollowingRedirects(
  url: string,
  headers: Record<string, string>,
): Promise<Response> {
  let currentUrl = url;
  let response = await launchpadFetch(currentUrl, { headers });
  for (let redirects = 0; redirects < MAX_REDIRECTS; redirects++) {
    const location = response.headers.get("location");
    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect || location === null) {
      break;
    }
    currentUrl = new URL(location, currentUrl).toString();
    response = await launchpadFetch(currentUrl, { headers });
  }
  return response;
}

function sourcePackagesFilterParams(
  distro: string,
  filter: PublishedSourcesFilter,
): QueryParams {
  return {
    status: filter.status,
    distro_series: filter.series
      ? `${apiBase()}/${encodeURIComponent(distro)}/${encodeURIComponent(filter.series)}`
      : undefined,
    source_name: filter.sourceName || undefined,
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

function cookieName(): string {
  return env.MAIN_LAUNCHPAD_COOKIE_NAME || "lp";
}

function apiBase(): string {
  const host = env.MAIN_LAUNCHPAD_BASE_HOST;
  if (!host) {
    throw new Error("MAIN_LAUNCHPAD_BASE_HOST is not set");
  }
  return new URL("/api/devel", host).toString();
}
