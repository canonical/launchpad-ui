import { http, HttpResponse } from "msw";
import type {
  BugImportance,
  BugStatus,
  CveSeverity,
  CveStatus,
  PackageBug,
} from "../../types.js";
import { matchesFilter, paginate } from "./helpers/list.js";
import { PACKAGES_API } from "./helpers/paths.js";
import {
  parseQuery,
  readFilterField,
  readPaginationQuery,
} from "./helpers/query.js";
import { withSourcePackage } from "./helpers/wrap.js";

const MERGE_PROPOSALS_MAX_PAGE_SIZE = 25;

const bugSortKey = (
  bug: PackageBug,
  field: string,
): string | number | undefined => {
  switch (field) {
    case "id":
      return bug.id;
    case "title":
      return bug.title;
    case "importance":
      return bug.importance;
    case "status":
      return bug.status;
    default:
      return undefined;
  }
};

export const sourcePackageDetailHandlers = [
  http.get(
    `${PACKAGES_API}/source-packages/:name`,
    withSourcePackage((seed) => HttpResponse.json(seed.details)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/binary-packages`,
    withSourcePackage((seed) => HttpResponse.json(seed.binariesGroup)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/ppa-versions`,
    withSourcePackage((seed, { request }) => {
      const query = parseQuery(new URL(request.url));
      return HttpResponse.json(
        paginate(seed.ppaVersions, readPaginationQuery(query)),
      );
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/bugs`,
    withSourcePackage((seed, { request }) => {
      const query = parseQuery(new URL(request.url));
      const seriesFilter = readFilterField(query, "series");
      const importanceFilter = readFilterField(query, "importance") as
        | BugImportance
        | BugImportance[]
        | undefined;
      const statusFilter = readFilterField(query, "status") as
        | BugStatus
        | BugStatus[]
        | undefined;

      const filtered = seed.bugs.filter(
        (bug) =>
          matchesFilter(bug.series?.name ?? "", seriesFilter) &&
          matchesFilter(bug.importance, importanceFilter) &&
          matchesFilter(bug.status, statusFilter),
      );

      return HttpResponse.json(
        paginate(filtered, readPaginationQuery(query), bugSortKey),
      );
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/cves`,
    withSourcePackage((seed, { request }) => {
      const query = parseQuery(new URL(request.url));
      const severityFilter = readFilterField(query, "severity") as
        | CveSeverity
        | CveSeverity[]
        | undefined;
      const statusFilter = readFilterField(query, "status") as
        | CveStatus
        | CveStatus[]
        | undefined;

      const filtered = seed.cves.filter(
        (cve) =>
          matchesFilter(cve.severity, severityFilter) &&
          matchesFilter(cve.status, statusFilter),
      );

      return HttpResponse.json(paginate(filtered, readPaginationQuery(query)));
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/merge-proposals`,
    withSourcePackage((seed, { request }) => {
      const query = readPaginationQuery(parseQuery(new URL(request.url)));
      const cappedSize =
        query.size === undefined
          ? undefined
          : Math.min(query.size, MERGE_PROPOSALS_MAX_PAGE_SIZE);
      return HttpResponse.json(
        paginate(seed.mergeProposals, {
          ...query,
          size: cappedSize ?? MERGE_PROPOSALS_MAX_PAGE_SIZE,
        }),
      );
    }),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/relationships`,
    withSourcePackage((seed) => HttpResponse.json(seed.relationships)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/upstream`,
    withSourcePackage((seed) => HttpResponse.json(seed.upstream)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/debian`,
    withSourcePackage((seed) => HttpResponse.json(seed.debian)),
  ),

  http.get(
    `${PACKAGES_API}/source-packages/:name/source`,
    withSourcePackage((seed) => HttpResponse.json(seed.source)),
  ),
];
