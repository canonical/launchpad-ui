import { HttpResponse, type HttpResponseResolver } from "msw";
import { findSourcePackage, findVersion } from "../../data/seeds/index.js";
import type { SourcePackageSeed } from "../../data/types.js";
import { delay } from "./latency.js";
import { sourcePackageNotFound, versionNotFound } from "./responses.js";

type Version = SourcePackageSeed["versions"][number];
type ResolverInfo = Parameters<HttpResponseResolver>[0];

export const safeWrap = (
  inner: (
    info: ResolverInfo,
  ) => Response | undefined | Promise<Response | undefined>,
): HttpResponseResolver => async (info) => {
  await delay();
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
