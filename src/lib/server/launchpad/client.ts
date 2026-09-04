import { launchpadFetch } from "./launchpadFetch.js";
import type {
  BinaryFileMeta,
  BinaryPackagePublishingEntry,
  Collection,
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
const MAX_COLLECTION_PAGES = 20;

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

export async function getPublishedBinaries(
  distro: string,
  sourcePackageId: string,
): Promise<BinaryPackagePublishingEntry[]> {
  const search = new URLSearchParams({
    "ws.op": "getPublishedBinaries",
    active_binaries_only: "true",
  });
  return getAllCollection(
    `${apiBase()}/${encodeURIComponent(distro)}/+archive/primary/+sourcepub/${encodeURIComponent(sourcePackageId)}?${search}`,
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

// TODO: Used now only for one api call
// That api call needs a product decision. May be removed in future
// 1. The limits implemented in internal query will reduce the amout of entries returned
// 2. Maybe we won't need pagination at all
// 3. If we do, lets consider UI based solution.
async function getAllCollection<T>(initialUrl: string): Promise<T[]> {
  const entries: T[] = [];
  const visited = new Set<string>();
  let pagesLoaded = 0;
  let url: string | undefined = initialUrl;

  while (url) {
    if (pagesLoaded >= MAX_COLLECTION_PAGES) {
      console.warn("Launchpad collection page limit reached", {
        initialUrl,
        nextUrl: url,
        pagesLoaded,
      });
      break;
    }
    if (visited.has(url)) {
      console.warn("Launchpad collection pagination loop detected", {
        initialUrl,
        repeatedUrl: url,
        pagesLoaded,
      });
      break;
    }
    visited.add(url);

    const collection: Collection<T> = await getCollection<T>(url);
    entries.push(...collection.entries);
    pagesLoaded += 1;
    url = collection.next_collection_link;
  }

  return entries;
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
