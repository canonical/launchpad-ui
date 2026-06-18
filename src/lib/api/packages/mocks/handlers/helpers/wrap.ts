import { HttpResponse } from "msw";
import type { HttpResponseResolver } from "msw";
import { DISTRO_QUERY_PARAM, SEEDED_DISTRO } from "../../../distro.js";
import { findSourcePackage, findVersion } from "../../data/seeds/index.js";
import type { SourcePackageSeed } from "../../data/types.js";
import { delay } from "./latency.js";
import { sourcePackageNotFound, versionNotFound } from "./responses.js";

type Version = SourcePackageSeed["versions"][number];
type ResolverInfo = Parameters<HttpResponseResolver>[0];

// All seeded data is for the `ubuntu` distro. Each route's `load()` threads its
// `[distro]` path param onto every API call as `?distro=<name>`. If the param is
// present and names a distro we don't seed, return 404 so `/{distro}/+source` etc.
// propagate it via each route's existing `error(res.response.status, …)` call. The
// param is treated as optional (missing → allow) so direct mock callers in
// `client.test.ts` keep working without modification.
const validateDistro = (info: ResolverInfo): Response | undefined => {
  const distro = new URL(info.request.url).searchParams.get(DISTRO_QUERY_PARAM);
  if (distro !== null && distro !== SEEDED_DISTRO) {
    return HttpResponse.json(
      {
        detail: `Distribution "${distro}" not found`,
        code: "distribution_not_found",
      },
      { status: 404 },
    );
  }
  return undefined;
};

export const safeWrap =
  (
    inner: (
      info: ResolverInfo,
    ) => Response | undefined | Promise<Response | undefined>,
  ): HttpResponseResolver =>
  async (info) => {
    await delay();
    const distroError = validateDistro(info);
    if (distroError) return distroError;
    try {
      return await inner(info);
    } catch (err) {
      return HttpResponse.json(
        {
          detail:
            err instanceof Error ? err.message : "Unexpected fixture error",
          code: "fixture_error",
        },
        { status: 500 },
      );
    }
  };

export const withSourcePackage = (
  inner: (
    seed: SourcePackageSeed,
    info: ResolverInfo,
  ) => Response | Promise<Response>,
): HttpResponseResolver =>
  safeWrap(async (info) => {
    const name = String(info.params.name);
    const seed = findSourcePackage(name);
    if (!seed) return sourcePackageNotFound(name);
    return inner(seed, info);
  });

export const withVersion = (
  inner: (
    seed: SourcePackageSeed,
    version: Version,
    info: ResolverInfo,
  ) => Response | Promise<Response>,
): HttpResponseResolver =>
  safeWrap(async (info) => {
    const name = String(info.params.name);
    const seed = findSourcePackage(name);
    if (!seed) return sourcePackageNotFound(name);
    const versionStr = String(info.params.version);
    const v = findVersion(seed, versionStr);
    if (!v) return versionNotFound(name, versionStr);
    return inner(seed, v, info);
  });
