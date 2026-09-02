import { launchpadFetch } from "./launchpadFetch.js";
import type {
  BinaryFileMeta,
  BinaryPackagePublishingEntry,
  Collection,
  PublishedBinariesQuery,
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
  return getCollection(
    archiveUrl(distro, "getPublishedSources", {
      "ws.size": query.size,
      "ws.start": query.start,
      order_by: query.orderBy,
      status: query.status,
    }),
  );
}

export function getPublishedBinaries(
  distro: string,
  query: PublishedBinariesQuery,
): Promise<Collection<BinaryPackagePublishingEntry>> {
  return getCollection(
    archiveUrl(distro, "getPublishedBinaries", {
      "ws.size": query.size,
      binary_name: query.binaryName,
      exact_match: "true",
      ordered: "false",
      status: "Published",
    }),
  );
}

export async function getBinaryFileUrls(
  publicationSelfLink: string,
): Promise<BinaryFileMeta[]> {
  const url = `${publicationSelfLink}?ws.op=binaryFileUrls&include_meta=true`;
  const response = await launchpadFetch(url, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
}

async function getCollection<T>(url: string): Promise<Collection<T>> {
  const response = await launchpadFetch(url, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new LaunchpadApiError(response.status, url);
  }
  return response.json();
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
