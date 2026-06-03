// `[distro]` is a route path param.
// Routes thread `params.distro` onto every API call via `params.query.distro`
// (typed on `BaseQuery` / `CollectionQuery` in `types.ts`); the MSW mock's
// `safeWrap` validates it against `SEEDED_DISTRO` and returns 404 for anything
// else. This is how `/debian/+source` (and friends) 404 without any route-level
// allowlist or +layout guard.

export const DISTRO_QUERY_PARAM = "distro";

export const SEEDED_DISTRO = "ubuntu";
