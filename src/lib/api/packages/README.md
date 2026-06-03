# `packages` API client (mocked via MSW)

Thin `openapi-fetch` wrapper for the `packages` API. In dev (`pnpm dev:mock`)
and tests, requests are intercepted by MSW (Mock Service Worker) — in-process on
the server (and in tests) and via a Service Worker in the browser. `client.ts`
has no knowledge of the mock; pointing `PUBLIC_PACKAGES_API_URL` at a real
backend swaps it out.

## Consumer usage

```ts
import { packagesApi } from "$lib/api/packages/client.js";

export const load = async ({ params, url, fetch }) => {
  const { data, error } = await packagesApi.GET("/source-packages/{name}", {
    params: {
      path: { name: params.name },
      query: { q: url.searchParams.get("q") ?? undefined },
    },
    fetch,
  });
  if (error) error(error.response?.status ?? 500, "Failed to load");
  return { sourcePackage: data };
};
```

`{ data, error, response }` is openapi-fetch's standard shape.

## Layout

```
client.ts          createClient<paths>() — reads PUBLIC_PACKAGES_API_URL
constants.ts       ERROR_INJECT_PARAM, DEFAULT_PAGE_SIZE
types.ts           Domain types + `paths` interface
client.test.ts     Vitest covering happy paths + error injection + fallback
mocks/
  server.ts        setupServer(...handlers) + appended fallback (Node/SSR/tests)
  browser.ts       setupWorker(...handlers) + appended fallback (browser)
  state.ts         Per-process mutable singletons + resetMockState()
  data/
    series.ts        SERIES + SeriesKey
    maintainers.ts   MAINTAINERS
    types.ts         SourcePackageSeed
    shared.ts        lp, dn, DEFAULT_ARCHES, versionSlug, stripEpoch
    binary-packages.ts  BINARY_PACKAGES + findBinaryPackage
    converters.ts    toListingItem, toUploadItem, toLatestVersion, …
    seeds/           One file per hero (libreoffice, firefox, …) + extras.ts
                     (compact-spec long tail) + index.ts (SOURCE_PACKAGES
                     registry + findSourcePackage + findVersion)
    index.ts         Barrel
  handlers/
    index.ts         [injectError, ...typed] in dispatch order
    inject-error.ts  Head wildcard for ?_inject_error=NNN
    fallback.ts      Tail wildcard (appended in server.ts / browser.ts)
    health.ts        /health
    binary-packages.ts             /binary-packages/{name}
    me.ts                          /me/packages-views GET + PUT
    source-packages.ts             /source-packages, /me/source-packages
    source-packages-detail.ts      /source-packages/{name}/* (except /versions/*)
    versions.ts                    /source-packages/{name}/versions/*
    helpers/
      latency.ts     delay() — keeps SvelteKit loading states reachable
      list.ts        paginate, matchesSearch, matchesFilter, asArray
      paths.ts       PACKAGES_API + handler-path → template conversion
      query.ts       parseQuery + readers
      responses.ts   notFound / badRequest / methodNotAllowed factories
      wrap.ts        safeWrap, withSourcePackage, withVersion
```

## How MSW is wired

- **Vitest** (`server` + `ssr` projects) loads `test/vitest-setup-msw.ts`,
  which calls `server.listen()` at module top level. It must run _before_
  `client.ts` evaluates `createClient` — openapi-fetch captures
  `globalThis.fetch` at create-time.
- **`pnpm dev:mock`** (mode=mock) loads `.env.mock`; `src/hooks.server.ts`
  calls `server.listen()` for SSR, and `src/hooks.client.ts` starts the browser
  `worker` so client-side universal `load` runs are mocked too. `pnpm dev`
  leaves MSW off.

## Error injection

```ts
await packagesApi.GET("/source-packages", {
  params: { query: { _inject_error: 503 } },
});
// → { data: undefined, error: { detail, code: "injected" }, response: <503> }
```

Status must be ≥ 400. Handled by `mocks/handlers/inject-error.ts`.

## Latency

Each handler awaits `delay()` (30ms, `mocks/handlers/helpers/latency.ts`) so
SvelteKit loading states are reachable in dev.

## 404 vs 405

`mocks/handlers/fallback.ts` distinguishes "unknown template" (404) from
"known template, unsupported method" (405) by re-deriving the route registry
from `server.listHandlers()` per request — so handlers added via
`server.use(...)` are also considered.

## Unmocking a single endpoint

To let one endpoint hit the real backend while the rest stay mocked, register
a runtime override that returns `passthrough()`:

```ts
import { http, passthrough } from "msw";
import { server } from "$lib/api/packages/mocks/server.js";
import { PACKAGES_API } from "$lib/api/packages/mocks/handlers/helpers/paths.js";

server.use(
  http.get(`${PACKAGES_API}/source-packages/:name`, () => passthrough()),
);
```

Place this in `src/hooks.server.ts` (for `pnpm dev:mock`) or in a vitest
setup (for tests). `server.use(...)` additions are evaluated before the typed
handlers, so the override wins. `resetHandlers()` (called in `afterEach`)
wipes runtime overrides between tests.

For the passthrough to actually reach a real server, `PUBLIC_PACKAGES_API_URL`
must point at one, otherwise the request resolves to whatever URL the client
built (e.g. `http://localhost/api/packages/...`) and fails.

## Migration path

The whole `mocks/` tree exists to be replaced — endpoint by endpoint. The
same `passthrough()` pattern gates every transition.

### Step 1. Replace a single endpoint with the real version

When a real endpoint comes online, flip just that handler's resolver:

```ts
// before
http.get(
  `${PACKAGES_API}/source-packages/:name`,
  withSourcePackage((seed) => HttpResponse.json(seed.details)),
),

// after — real endpoint exists now
http.get(
  `${PACKAGES_API}/source-packages/:name`,
  () => passthrough(),
),
```

The route stays registered so the fallback keeps giving 405 for unsupported
methods on it. The diff makes the mock-vs-real boundary visible. Endpoints
still in MSW are unaffected.

`PUBLIC_PACKAGES_API_URL` must point at the partial real backend.

### Step 2 (optional). Go through Prism first

If the team prefers to land an OpenAPI spec before wiring real handlers,
Prism can serve a partial spec while MSW serves the rest. They coexist
because MSW intercepts first; `passthrough()` sends the request out to
`PUBLIC_PACKAGES_API_URL`, which is now Prism's port.

1. `.api-spec/packages.yaml` — start with just the endpoints you've specced.
2. `"mock-packages-server": "prism mock .api-spec/packages.yaml --port 4011"`.
3. `PUBLIC_PACKAGES_API_URL=http://localhost:4011` in `.env.mock`.
4. For each endpoint added to the spec, flip its MSW handler to `passthrough()`.

Switching from Prism to the real backend later is one env-var change —
`PUBLIC_PACKAGES_API_URL` only.

### Final cleanup

When every handler is `passthrough()`, MSW is contributing nothing. Then:

1. Delete `src/lib/api/packages/mocks/` and `static/mockServiceWorker.js`.
2. Delete `src/hooks.server.ts` and `src/hooks.client.ts`.
3. Drop `setupFiles` from `vite.config.ts`'s `server`/`ssr` projects;
   delete `test/vitest-setup-msw.ts`.
4. Regenerate `types.ts` from the spec via `openapi-typescript`.

`client.ts` doesn't change.

## Query param conventions

| Param           | Meaning                                                     |
| --------------- | ----------------------------------------------------------- |
| `q`             | Combined search across name + description + maintainer name |
| `page`          | 1-indexed page number                                       |
| `size`          | Page size (default 25); `"all"` on listing endpoints        |
| `sort`          | Field name; prefix with `-` for descending                  |
| `filter.<key>`  | Nested object. OR within field, AND across fields           |
| `_inject_error` | Mock-only. Force a non-2xx response                         |

## Status enums

- `PublishingStatus`: Published | Pending | Superseded | Deleted | Obsolete
- `VersionStatus`: PublishingStatus + Accepted | Unapproved | Rejected | New
- `Pocket`: Release | Security | Updates | Proposed | Backports
- `Priority`: Required | Important | Standard | Optional | Extra
- `Architecture`: amd64, arm64, armhf, i386, ppc64el, riscv64, s390x, all
- `BuildStatus`: success | failure | building | pending | cancelled | depwait | chrootwait
- `BugImportance` / `BugStatus`: Launchpad's standard set
- `CveSeverity`: negligible | low | medium | high | critical
- `CveStatus`: active | released | ignored | mitigated (normalised form of
  Ubuntu's `Needs evaluation` / `Vulnerable` / `Fixed`)

## Write endpoints

| Method + path            | Body                      | Response                  |
| ------------------------ | ------------------------- | ------------------------- |
| `GET /me/packages-views` | —                         | `PackagesViewsPreference` |
| `PUT /me/packages-views` | `PackagesViewsPreference` | `PackagesViewsPreference` |

State lives in `mocks/state.ts` and persists until `resetMockState()` (called
from the top-level `beforeEach` in `client.test.ts`). PUT returns `400` on a
malformed body. `_inject_error` works on both.
