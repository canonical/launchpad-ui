import { HttpResponse, http } from "msw";
import type { VersionSourceFile } from "../../types.js";
import {
  toCurrentVersionItem,
  toLatestVersion,
  toUploadItem,
  toVersionBinaryPackages,
  toVersionBuildRequirements,
  toVersionDetails,
  toVersionPublishing,
  toVersionSourceFiles,
} from "../data/converters.js";
import {
  asArray,
  matchesFilter,
  matchesSearch,
  paginate,
} from "./helpers/list.js";
import { PACKAGES_API } from "./helpers/paths.js";
import {
  parseQuery,
  readFilterField,
  readPaginationQuery,
  readString,
} from "./helpers/query.js";
import { withSourcePackage, withVersion } from "./helpers/wrap.js";

// Literal-suffix paths (`/latest`, `/current`) MUST precede `/:version` —
// otherwise MSW matches them as `version = "latest"`.
export const versionsHandlers = [
  http.get(
    `${PACKAGES_API}/source-packages/:name/versions`,
    withSourcePackage((seed, { request }) => {
      const query = parseQuery(new URL(request.url));
      const seriesFilter = readFilterField(query, "series");
      const pocketFilter = readFilterField(query, "pocket");
      const statusFilter = readFilterField(query, "status");

      const items = seed.versions
        .filter((v) => matchesFilter(v.series, seriesFilter))
        .filter((v) => matchesFilter(v.pocket, pocketFilter))
        .filter((v) => matchesFilter(v.status, statusFilter))
        .map((v) => toUploadItem(seed, v));

      const pagination = readPaginationQuery(query);
      const sortedQuery = {
        ...pagination,
        sort: pagination.sort ?? "-uploadDateTime",
      };

      return HttpResponse.json(
        paginate(items, sortedQuery, (item, field) => {
          switch (field) {
            case "uploadDateTime":
              return item.uploadDateTime;
            case "version":
              return item.version;
            case "status":
              return item.status;
            case "series":
              return item.series.name;
            case "pocket":
              return item.pocket;
            case "component":
              return item.component;
            default:
              return undefined;
          }
        }),
      );
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/latest`,
    withSourcePackage((seed) => HttpResponse.json(toLatestVersion(seed))),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/current`,
    withSourcePackage((seed, { request }) => {
      const query = parseQuery(new URL(request.url));
      const seriesFilter = asArray(readFilterField(query, "series"));

      const items = seed.versions
        .filter((v) => v.isCurrent === true)
        .filter(
          (v) => seriesFilter.length === 0 || seriesFilter.includes(v.series),
        )
        .map((v) => toCurrentVersionItem(seed, v));

      return HttpResponse.json(items);
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version/source-files`,
    withVersion((seed, version, { request }) => {
      const files = toVersionSourceFiles(seed, version);
      const sort = readString(parseQuery(new URL(request.url)).sort);
      if (sort) {
        const desc = sort.startsWith("-");
        const field = desc ? sort.slice(1) : sort;
        const pick = (item: VersionSourceFile): string | undefined => {
          switch (field) {
            case "fileName":
              return item.fileName;
            case "fileSize":
              return item.fileSize;
            case "downloadUrl":
              return item.downloadUrl;
            case "shaChecksum":
              return item.shaChecksum;
            default:
              return undefined;
          }
        };
        files.sort((a, b) => {
          const va = pick(a);
          const vb = pick(b);
          if (va === vb) return 0;
          if (va === undefined) return 1;
          if (vb === undefined) return -1;
          return va < vb ? (desc ? 1 : -1) : desc ? -1 : 1;
        });
      }
      return HttpResponse.json(files);
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version/binary-packages`,
    withVersion((seed, _version, { request }) => {
      const query = parseQuery(new URL(request.url));
      const q = readString(query.q);
      const items = toVersionBinaryPackages(seed).filter((b) =>
        matchesSearch(q, [b.name, b.description]),
      );
      return HttpResponse.json(
        paginate(items, readPaginationQuery(query), (item, field) =>
          field === "name" ? item.name : undefined,
        ),
      );
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version/build-requirements`,
    withVersion((seed) => HttpResponse.json(toVersionBuildRequirements(seed))),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version/publishing`,
    withVersion((seed, version) =>
      HttpResponse.json(toVersionPublishing(seed, version)),
    ),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version/upstream`,
    withVersion((seed) => HttpResponse.json(seed.versionUpstream)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/versions/:version`,
    withVersion((seed, version) =>
      HttpResponse.json(toVersionDetails(seed, version)),
    ),
  ),
];
