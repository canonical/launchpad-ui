import { launchpadFetch } from "./launchpadFetch.js";
import type {
  Collection,
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

type QueryParamValue = string | number | undefined;

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
  filter: PublishedSourcesFilter,
): Record<string, QueryParamValue | QueryParamValue[]> {
  return {
    status: filter.status,
    distro_series:
      filter.series === undefined
        ? undefined
        : `${apiBase()}/${encodeURIComponent(distro)}/${encodeURIComponent(filter.series)}`,
  };
}

function archiveUrl(
  distro: string,
  operation: string,
  params: Record<string, QueryParamValue | QueryParamValue[]>,
): string {
  const search = new URLSearchParams({ "ws.op": operation });
  for (const [name, value] of Object.entries(params)) {
    for (const item of Array.isArray(value) ? value : [value]) {
      if (item !== undefined) {
        search.append(name, String(item));
      }
    }
  }
  return `${apiBase()}/${encodeURIComponent(distro)}/+archive/primary?${search}`;
}

function apiBase(): string {
  const host = env.MAIN_LAUNCHPAD_BASE_HOST;
  if (!host) {
    throw new Error("MAIN_LAUNCHPAD_BASE_HOST is not set");
  }
  return new URL("/api/devel", host).toString();
}
