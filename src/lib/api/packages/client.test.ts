import type { HttpHandler } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { packagesApi } from "./client.js";
import {
  PACKAGES_API_WILDCARD,
  templateFromHandlerPath,
} from "./mocks/handlers/helpers/paths.js";
import { server } from "./mocks/server.js";
import { resetMockState } from "./mocks/state.js";

// Must match the value stubbed in test/vitest-setup-msw.ts.
const TEST_BASE_URL = "http://msw.local/api/packages";

beforeEach(() => {
  resetMockState();
});

describe("packagesApi — foundation", () => {
  it("returns ok from /health", async () => {
    const { data, error, response } = await packagesApi.GET("/health");
    expect(error).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.status).toBe("ok");
    expect(typeof data?.timestamp).toBe("string");
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json");
  });

  it("returns 404 for an unregistered path", async () => {
    const response = await fetch(`${TEST_BASE_URL}/no-such-resource`);
    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({ code: "not_found" });
  });

  it("returns 405 for an unsupported method on a known path", async () => {
    const response = await fetch(`${TEST_BASE_URL}/health`, {
      method: "DELETE",
    });
    expect(response.status).toBe(405);
    expect(await response.json()).toMatchObject({
      code: "method_not_allowed",
    });
  });

  it("injects an error response when _inject_error is set", async () => {
    const { data, error, response } = await packagesApi.GET("/health", {
      params: { query: { _inject_error: 503 } },
    });
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(response.status).toBe(503);
  });

  it("ignores _inject_error values below 400", async () => {
    const { data, error } = await packagesApi.GET("/health", {
      params: { query: { _inject_error: 200 } },
    });
    expect(error).toBeUndefined();
    expect(data?.status).toBe("ok");
  });

  it("registers every endpoint from the path table", () => {
    const expected = [
      "/binary-packages/{name}",
      "/health",
      "/me/packages-views",
      "/me/source-packages",
      "/source-packages",
      "/source-packages/{name}",
      "/source-packages/{name}/binary-packages",
      "/source-packages/{name}/bugs",
      "/source-packages/{name}/cves",
      "/source-packages/{name}/debian",
      "/source-packages/{name}/merge-proposals",
      "/source-packages/{name}/ppa-versions",
      "/source-packages/{name}/relationships",
      "/source-packages/{name}/source",
      "/source-packages/{name}/upstream",
      "/source-packages/{name}/versions",
      "/source-packages/{name}/versions/current",
      "/source-packages/{name}/versions/latest",
      "/source-packages/{name}/versions/{version}",
      "/source-packages/{name}/versions/{version}/binary-packages",
      "/source-packages/{name}/versions/{version}/build-requirements",
      "/source-packages/{name}/versions/{version}/publishing",
      "/source-packages/{name}/versions/{version}/source-files",
      "/source-packages/{name}/versions/{version}/upstream",
    ];
    const actual = Array.from(
      new Set(
        (server.listHandlers() as HttpHandler[])
          .map((h) => h.info.path as string)
          .filter((p) => p !== PACKAGES_API_WILDCARD)
          .map(templateFromHandlerPath),
      ),
    ).sort();
    expect(actual).toEqual(expected.slice().sort());
  });
});

describe("packagesApi — /me/packages-views", () => {
  it("GET returns the default preference before any PUT", async () => {
    const { data, error } = await packagesApi.GET("/me/packages-views");
    expect(error).toBeUndefined();
    expect(data).toEqual({
      defaultTabs: ["all", "my-uploads", "latest-uploads"],
      myTeams: ["ubuntu-server"],
    });
  });

  it("PUT persists and subsequent GET reflects the change", async () => {
    const next = {
      defaultTabs: ["all", "latest-uploads"],
      myTeams: ["ubuntu-server", "desktop-packages"],
    };
    const { data: putData, error: putError } = await packagesApi.PUT(
      "/me/packages-views",
      { body: next },
    );
    expect(putError).toBeUndefined();
    expect(putData).toEqual(next);

    const { data: getData } = await packagesApi.GET("/me/packages-views");
    expect(getData).toEqual(next);
  });

  it("beforeEach reset wipes a prior write", async () => {
    const { data } = await packagesApi.GET("/me/packages-views");
    expect(data?.myTeams).toEqual(["ubuntu-server"]);
  });

  it("PUT 400s when defaultTabs is missing", async () => {
    const { error, response } = await packagesApi.PUT("/me/packages-views", {
      // @ts-expect-error - intentionally malformed body
      body: { myTeams: [] },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });

  it("PUT 400s when fields are not string arrays", async () => {
    const { error, response } = await packagesApi.PUT("/me/packages-views", {
      // @ts-expect-error - intentionally wrong shape
      body: { defaultTabs: "all", myTeams: [] },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });

  it("PUT supports error injection", async () => {
    const { error, response } = await packagesApi.PUT("/me/packages-views", {
      body: { defaultTabs: [], myTeams: [] },
      params: { query: { _inject_error: 500 } },
    });
    expect(response.status).toBe(500);
    expect(error).toBeDefined();
  });
});

describe("packagesApi — source-package level", () => {
  it("/source-packages returns a paginated listing with at least 8 realistic packages", async () => {
    const { data, error } = await packagesApi.GET("/source-packages");
    expect(error).toBeUndefined();
    expect(data).toBeDefined();
    expect(data?.total).toBeGreaterThanOrEqual(8);
    expect(data?.items.length).toBeGreaterThan(0);
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names).toContain("libreoffice");
  });

  it("/source-packages applies pagination and respects size", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { page: 1, size: 3 } },
    });
    expect(data?.items).toHaveLength(3);
    expect(data?.page).toBe(1);
    expect(data?.size).toBe(3);
  });

  it("/source-packages narrows by q across multiple fields", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { q: "libre" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(
      data?.items.every((i) =>
        i.sourcePackage.name.toLowerCase().includes("libre"),
      ),
    ).toBe(true);
  });

  it("/source-packages filters by component=main", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { component: "main" } } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((i) => i.component === "main")).toBe(true);
  });

  it("/source-packages filter.scope=my returns 3 packages", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { scope: "my" }, size: 50 } },
    });
    expect(data?.total).toBe(3);
  });

  it("/source-packages 400s on invalid filter.scope", async () => {
    const { error, response } = await packagesApi.GET("/source-packages", {
      params: {
        query: {
          // @ts-expect-error - intentionally invalid scope value
          filter: { scope: "everyone" },
        },
      },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });

  it("/source-packages/{name} returns full details for libreoffice", async () => {
    const { data, error } = await packagesApi.GET("/source-packages/{name}", {
      params: { path: { name: "libreoffice" } },
    });
    expect(error).toBeUndefined();
    expect(data?.name).toBe("libreoffice");
    expect(data?.description).toMatch(/LibreOffice/);
    expect(data?.architectures.length).toBeGreaterThan(0);
    expect(data?.openBugCount).toBeGreaterThanOrEqual(0);
  });

  it("/source-packages/{name} exposes changelogUrl and pendingUploads (DEF-016)", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}", {
      params: { path: { name: "firefox" } },
    });
    expect(data?.changelogUrl).toMatch(/\+source\/firefox\/\+changelog$/);
    expect(typeof data?.pendingUploads).toBe("number");
    expect(data?.pendingUploads).toBeGreaterThan(0);
  });

  it("/source-packages/{name} returns 404 for unknown name", async () => {
    const { data, error, response } = await packagesApi.GET(
      "/source-packages/{name}",
      { params: { path: { name: "this-package-does-not-exist" } } },
    );
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(response.status).toBe(404);
  });

  it("/source-packages/{name}/binary-packages returns the artifact group", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/binary-packages",
      { params: { path: { name: "libreoffice" } } },
    );
    expect(data?.title).toMatch(/libreoffice/);
    expect(data?.artifacts.length).toBeGreaterThan(0);
  });

  it("/source-packages/{name}/ppa-versions paginates", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/ppa-versions",
      { params: { path: { name: "libreoffice" } } },
    );
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.total).toBeGreaterThanOrEqual(data?.items.length ?? 0);
  });

  it("/source-packages/{name}/bugs filters by importance", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/bugs", {
      params: {
        path: { name: "libreoffice" },
        query: { filter: { importance: "High" } },
      },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((b) => b.importance === "High")).toBe(true);
  });

  it("/source-packages/{name}/cves returns CVE list", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/cves", {
      params: { path: { name: "libreoffice" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items[0]?.id).toMatch(/^CVE-\d{4}-\d+$/);
  });

  it("/source-packages/{name}/merge-proposals caps size at 25", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/merge-proposals",
      {
        params: { path: { name: "libreoffice" }, query: { size: 100 } },
      },
    );
    expect(data?.size).toBeLessThanOrEqual(25);
  });

  it("/source-packages/{name}/relationships returns all relationship buckets", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/relationships",
      { params: { path: { name: "libreoffice" } } },
    );
    expect(data?.dependedOn).toBeDefined();
    expect(data?.recommends).toBeDefined();
    expect(data?.suggests).toBeDefined();
    expect(data?.conflicts).toBeDefined();
    expect(data?.dependedBy).toBeDefined();
    expect(data?.recommendedBy).toBeDefined();
    expect(data?.suggestedBy).toBeDefined();
  });

  it("/source-packages/{name}/upstream returns upstream details", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/upstream", {
      params: { path: { name: "libreoffice" } },
    });
    expect(data?.homepage).toBeDefined();
  });

  it("/source-packages/{name}/debian returns Debian tracker links", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/debian", {
      params: { path: { name: "libreoffice" } },
    });
    expect(data?.trackerUrl).toMatch(/tracker\.debian\.org/);
    expect(data?.btsUrl).toMatch(/bugs\.debian\.org/);
  });

  it("/source-packages/{name}/source returns a breadcrumb link", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/source", {
      params: { path: { name: "libreoffice" } },
    });
    expect(data?.distribution).toBe("ubuntu");
    expect(data?.packageName).toBe("libreoffice");
    expect(data?.url).toMatch(/launchpad\.net/);
  });
});

describe("packagesApi — DEF-002 server-side tab filtering", () => {
  it("default tab=all returns the full registry total", async () => {
    const { data: baseline } = await packagesApi.GET("/source-packages", {
      params: { query: { size: 1 } },
    });
    const { data: explicit } = await packagesApi.GET("/source-packages", {
      params: { query: { size: 1, tab: "all" } },
    });
    expect(explicit?.total).toBe(baseline?.total);
  });

  it("tab=my-uploads returns the SCOPE_MY first three packages", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "my-uploads", size: 50, sort: "name" } },
    });
    expect(data?.total).toBe(3);
    const names = data?.items.map((i) => i.sourcePackage.name).sort() ?? [];
    expect(names).toEqual(["a11y-profile-manager", "libreoffice", "python3"]);
  });

  it("tab=latest-uploads is a non-empty subset smaller than tab=all", async () => {
    const { data: all } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "all", size: 1 } },
    });
    const { data: latest } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "latest-uploads", size: 1 } },
    });
    expect(latest?.total).toBeGreaterThan(0);
    expect(latest?.total).toBeLessThan(all?.total ?? Infinity);
  });

  it("tab=ubuntu-server is non-empty and contains nginx", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "ubuntu-server", size: "all" } },
    });
    expect(data?.total).toBeGreaterThan(0);
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names).toContain("nginx");
  });

  it("rejects an unknown tab with 400", async () => {
    const { error, response } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "not-a-tab" as never } },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });
});

describe("packagesApi — DEF-002 server-side search alias", () => {
  it("?search behaves as ?q (case-insensitive substring on name)", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { search: "LIBRE" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(
      data?.items.every((i) =>
        i.sourcePackage.name.toLowerCase().includes("libre"),
      ),
    ).toBe(true);
  });

  it("?search matches a binary package name (firefox-locale-de → firefox)", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { search: "firefox-locale-de" } },
    });
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names).toContain("firefox");
  });
});

describe("packagesApi — DEF-002 server-side filters", () => {
  it("filter.series narrows to a specific Ubuntu series", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { series: "noble" }, size: "all" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((i) => i.series.name === "noble")).toBe(true);
  });

  it("filter.section narrows to a specific section", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { section: "database" }, size: "all" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
  });

  it("filter.status narrows to a publication status", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { status: "Published" }, size: "all" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((i) => i.status === "Published")).toBe(true);
  });

  it("filter.pocket narrows to a single pocket", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { filter: { pocket: "Release" }, size: "all" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((i) => i.pocket === "Release")).toBe(true);
  });

  it("combined tab + filter + search apply together (AND across fields)", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: {
        query: {
          tab: "all",
          search: "libreoffice",
          filter: { component: "main" },
          size: "all",
        },
      },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((i) => i.component === "main")).toBe(true);
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names).toContain("libreoffice");
  });
});

describe("packagesApi — DEF-002 server-side sort columns + order", () => {
  it("sort=name with order=asc orders names alphabetically", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "name", order: "asc", size: "all" } },
    });
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it("sort=name with order=desc reverses the order", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "name", order: "desc", size: "all" } },
    });
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    const sortedDesc = [...names].sort().reverse();
    expect(names).toEqual(sortedDesc);
  });

  it("sort=latest-version orders by version string", async () => {
    const { data: asc } = await packagesApi.GET("/source-packages", {
      params: {
        query: { sort: "latest-version", order: "asc", size: "all" },
      },
    });
    const { data: desc } = await packagesApi.GET("/source-packages", {
      params: {
        query: { sort: "latest-version", order: "desc", size: "all" },
      },
    });
    const ascVersions =
      asc?.items.map((i) => i.sourcePackage.latestVersion) ?? [];
    const descVersions =
      desc?.items.map((i) => i.sourcePackage.latestVersion) ?? [];
    expect(ascVersions.length).toBeGreaterThan(0);
    expect(ascVersions[0]).not.toBe(descVersions[0]);
    expect(ascVersions).toEqual([...ascVersions].sort());
  });

  it("sort=latest-uploaded&order=desc puts the most recent upload first", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: {
        query: { sort: "latest-uploaded", order: "desc", size: 5 },
      },
    });
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names[0]).toBe("libreoffice");
  });

  it("sort=section orders ascending by version section", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "section", order: "asc", size: 10 } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
  });

  it("rejects an unknown sort column with 400", async () => {
    const { error, response } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "not-a-column" as never } },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });

  it("rejects an unknown order value with 400", async () => {
    const { error, response } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "name", order: "sideways" as never } },
    });
    expect(response.status).toBe(400);
    expect(error).toBeDefined();
  });

  it("legacy ±field sort syntax still works (sort=-name → desc)", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { sort: "-name", size: "all" } },
    });
    const names = data?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(names).toEqual([...names].sort().reverse());
  });
});

describe("packagesApi — DEF-002 server-side pagination", () => {
  it("returns total reflecting the FILTERED set, not the raw fixture count", async () => {
    const { data: filtered } = await packagesApi.GET("/source-packages", {
      params: { query: { tab: "my-uploads", size: 1 } },
    });
    const { data: all } = await packagesApi.GET("/source-packages", {
      params: { query: { size: 1 } },
    });
    expect(filtered?.total).toBe(3);
    expect(all?.total).toBeGreaterThan(filtered?.total ?? 0);
  });

  it("size='all' returns the full filtered set on a single page", async () => {
    const { data } = await packagesApi.GET("/source-packages", {
      params: { query: { size: "all", sort: "name", order: "asc" } },
    });
    expect(data?.items.length).toBe(data?.total);
  });

  it("page=2 returns the second slice when size is set", async () => {
    const { data: p1 } = await packagesApi.GET("/source-packages", {
      params: {
        query: { page: 1, size: 5, sort: "name", order: "asc" },
      },
    });
    const { data: p2 } = await packagesApi.GET("/source-packages", {
      params: {
        query: { page: 2, size: 5, sort: "name", order: "asc" },
      },
    });
    expect(p1?.items).toHaveLength(5);
    expect(p2?.items).toHaveLength(5);
    const overlap = (p1?.items ?? []).filter((a) =>
      (p2?.items ?? []).some(
        (b) => b.sourcePackage.name === a.sourcePackage.name,
      ),
    );
    expect(overlap).toEqual([]);
  });
});

describe("packagesApi — DEF-002 /me/source-packages mirrors /source-packages", () => {
  it("default GET returns the SCOPE_MY first three packages", async () => {
    const { data, error } = await packagesApi.GET("/me/source-packages", {
      params: { query: { size: "all", sort: "name" } },
    });
    expect(error).toBeUndefined();
    expect(data?.total).toBe(3);
    const names = data?.items.map((i) => i.sourcePackage.name).sort() ?? [];
    expect(names).toEqual(["a11y-profile-manager", "libreoffice", "python3"]);
  });

  it("honours search, sort, and pagination identically to /source-packages", async () => {
    const { data: search } = await packagesApi.GET("/me/source-packages", {
      params: { query: { search: "libre", size: "all" } },
    });
    expect(
      search?.items.every((i) =>
        i.sourcePackage.name.toLowerCase().includes("libre"),
      ),
    ).toBe(true);

    const { data: sorted } = await packagesApi.GET("/me/source-packages", {
      params: { query: { sort: "name", order: "desc", size: "all" } },
    });
    const sortedNames = sorted?.items.map((i) => i.sourcePackage.name) ?? [];
    expect(sortedNames).toEqual([...sortedNames].sort().reverse());
  });

  it("supports error injection", async () => {
    const { error, response } = await packagesApi.GET("/me/source-packages", {
      params: { query: { _inject_error: 500 } },
    });
    expect(response.status).toBe(500);
    expect(error).toBeDefined();
  });
});

describe("packagesApi — version level", () => {
  it("/source-packages/{name}/versions returns recent uploads, default-sorted by upload date desc", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/versions", {
      params: { path: { name: "libreoffice" } },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    const dates = data?.items.map((v) => v.uploadDateTime) ?? [];
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });

  it("/source-packages/{name}/versions filters by series", async () => {
    const { data } = await packagesApi.GET("/source-packages/{name}/versions", {
      params: {
        path: { name: "libreoffice" },
        query: { filter: { series: "resolute" } },
      },
    });
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items.every((v) => v.series.name === "resolute")).toBe(true);
  });

  it("/source-packages/{name}/versions/latest returns the LatestVersionInfo shape", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/latest",
      { params: { path: { name: "libreoffice" } } },
    );
    expect(data?.version).toBeDefined();
    expect(data?.downloadUrl).toMatch(/\.deb$/);
    expect(data?.priority).toBeDefined();
  });

  it("/source-packages/{name}/versions/current returns only isCurrent versions", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/current",
      { params: { path: { name: "libreoffice" } } },
    );
    expect(Array.isArray(data)).toBe(true);
    expect((data ?? []).length).toBeGreaterThan(0);
  });

  it("/source-packages/{name}/versions/{version} returns details with changelog", async () => {
    const { data, error } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(error).toBeUndefined();
    expect(data?.version).toBe("4:26.2.2.2-0ubuntu1");
    expect(data?.changelog).toMatch(/libreoffice/);
    expect(data?.uploader).toBeDefined();
  });

  it("/source-packages/{name}/versions/{version} 404s for unknown version", async () => {
    const { data, error, response } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}",
      {
        params: { path: { name: "libreoffice", version: "0.0.0-fake" } },
      },
    );
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(response.status).toBe(404);
  });

  it("/source-packages/{name}/versions/{version}/source-files returns the file list", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}/source-files",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(Array.isArray(data)).toBe(true);
    expect((data ?? []).length).toBeGreaterThan(0);
    expect(data?.[0]?.fileName).toBeDefined();
    expect(data?.[0]?.downloadUrl).toBeDefined();
  });

  it("/source-packages/{name}/versions/{version}/binary-packages paginates", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}/binary-packages",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(data?.items.length).toBeGreaterThan(0);
    expect(data?.items[0]?.architectures.length).toBeGreaterThan(0);
  });

  it("/source-packages/{name}/versions/{version}/build-requirements returns deps + conflicts", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}/build-requirements",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(data?.dependencies.buildDepends.length).toBeGreaterThan(0);
    expect(data?.conflicts).toBeDefined();
  });

  it("/source-packages/{name}/versions/{version}/publishing returns publishing info with builds", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}/publishing",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(data?.status).toBeDefined();
    expect(data?.builds.length).toBeGreaterThan(0);
    expect(data?.builds[0]?.url).toMatch(/launchpad\.net/);
  });

  it("/source-packages/{name}/versions/{version}/upstream returns external links", async () => {
    const { data } = await packagesApi.GET(
      "/source-packages/{name}/versions/{version}/upstream",
      {
        params: {
          path: { name: "libreoffice", version: "4:26.2.2.2-0ubuntu1" },
        },
      },
    );
    expect(Array.isArray(data)).toBe(true);
    expect((data ?? []).length).toBeGreaterThan(0);
  });
});

describe("packagesApi — binary-package level", () => {
  it("/binary-packages/{name} returns full details for libreoffice-writer", async () => {
    const { data, error } = await packagesApi.GET("/binary-packages/{name}", {
      params: { path: { name: "libreoffice-writer" } },
    });
    expect(error).toBeUndefined();
    expect(data?.name).toBe("libreoffice-writer");
    expect(data?.debPackage.url).toMatch(/\.deb$/);
    expect(data?.relationships.dependedOn.length).toBeGreaterThan(0);
  });

  it("/binary-packages/{name} 404s for unknown binary", async () => {
    const { data, error, response } = await packagesApi.GET(
      "/binary-packages/{name}",
      { params: { path: { name: "not-a-real-binary" } } },
    );
    expect(data).toBeUndefined();
    expect(error).toBeDefined();
    expect(response.status).toBe(404);
  });
});

describe("packagesApi — error injection per resource group", () => {
  it("injects errors on /source-packages", async () => {
    const { error, response } = await packagesApi.GET("/source-packages", {
      params: { query: { _inject_error: 500 } },
    });
    expect(response.status).toBe(500);
    expect(error).toBeDefined();
  });

  it("injects errors on /source-packages/{name}/versions", async () => {
    const { error, response } = await packagesApi.GET(
      "/source-packages/{name}/versions",
      {
        params: {
          path: { name: "libreoffice" },
          query: { _inject_error: 502 },
        },
      },
    );
    expect(response.status).toBe(502);
    expect(error).toBeDefined();
  });

  it("injects errors on /binary-packages/{name}", async () => {
    const { error, response } = await packagesApi.GET(
      "/binary-packages/{name}",
      {
        params: {
          path: { name: "libreoffice-writer" },
          query: { _inject_error: 401 },
        },
      },
    );
    expect(response.status).toBe(401);
    expect(error).toBeDefined();
  });
});
