import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LaunchpadApiError,
  getPublishedSources,
  getPublishedSourcesTotal,
} from "$lib/server/launchpad/client.js";
import {
  getSourcePackages,
  getSourcePackagesTotal,
} from "./packages.remote.js";

vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock("$lib/server/launchpad/client.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("$lib/server/launchpad/client.js")>()),
  getPublishedSources: vi.fn(),
  getPublishedSourcesTotal: vi.fn(),
}));

const listArgs = {
  distro: "ubuntu",
  sortKey: null,
  sortOrder: "none",
  page: 1,
  size: 25,
} as const;

beforeEach(() => {
  vi.mocked(getPublishedSources).mockReset().mockResolvedValue({
    start: 0,
    entries: [],
  });
  vi.mocked(getPublishedSourcesTotal).mockReset().mockResolvedValue(12);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("package filter queries", () => {
  it("uses the same filters for rows and totals and applies pagination only to rows", async () => {
    const filters = {
      search: " superhref ",
      match: "exact",
      series: "stonking",
      pocket: "Updates",
      maintainer: "ubuntu-mozillateam",
      signer: "userl",
      ubuntuChange: true,
      allStatuses: true,
    } as const;
    await getSourcePackages({ ...listArgs, ...filters, page: 3, size: 50 });
    await getSourcePackagesTotal({ distro: "ubuntu", ...filters });

    const expected = {
      sourceName: "superhref",
      exactMatch: true,
      series: "stonking",
      pocket: "Updates",
      maintainedBy: "ubuntu-mozillateam",
      signedBy: "userl",
      ubuntuChange: true,
      status: undefined,
    };
    expect(getPublishedSources).toHaveBeenCalledWith("ubuntu", {
      ...expected,
      size: 50,
      start: 100,
      orderBy: ["-date_created"],
    });
    expect(getPublishedSourcesTotal).toHaveBeenCalledWith("ubuntu", expected);
  });

  it.each([undefined, null, false])(
    "preserves default statuses and ordering with flags set to %s",
    async (flag) => {
      const filters = { allStatuses: flag, ubuntuChange: flag };
      await getSourcePackages({ ...listArgs, ...filters });
      await getSourcePackagesTotal({ distro: "ubuntu", ...filters });

      const expected = {
        series: undefined,
        status: ["Pending", "Published", "Obsolete"],
        sourceName: undefined,
        exactMatch: false,
        pocket: undefined,
        maintainedBy: undefined,
        signedBy: undefined,
        ubuntuChange: flag,
      };
      expect(getPublishedSources).toHaveBeenCalledWith("ubuntu", {
        ...expected,
        size: 25,
        start: 0,
        orderBy: ["-date_created"],
      });
      expect(getPublishedSourcesTotal).toHaveBeenCalledWith("ubuntu", expected);
    },
  );

  it("passes null filters through to the client for both rows and totals", async () => {
    const filters = {
      search: null,
      match: null,
      series: null,
      pocket: null,
      maintainer: null,
      signer: null,
      ubuntuChange: null,
      allStatuses: null,
    };
    await getSourcePackages({ ...listArgs, ...filters });
    await getSourcePackagesTotal({ distro: "ubuntu", ...filters });

    const expected = {
      sourceName: null,
      exactMatch: false,
      series: null,
      pocket: null,
      maintainedBy: null,
      signedBy: null,
      ubuntuChange: null,
      status: ["Pending", "Published", "Obsolete"],
    };
    expect(getPublishedSources).toHaveBeenCalledWith("ubuntu", {
      ...expected,
      size: 25,
      start: 0,
      orderBy: ["-date_created"],
    });
    expect(getPublishedSourcesTotal).toHaveBeenCalledWith("ubuntu", expected);
  });

  it.each([
    { search: "" },
    { search: " " },
    { search: "a".repeat(201) },
    { series: "" },
    { series: "Bad Value" },
    { maintainer: "" },
    { maintainer: "Bad Name" },
    { signer: "" },
    { signer: "-invalid" },
  ])("still rejects invalid non-null filters: %j", async (filters) => {
    await expect(
      getSourcePackages({ ...listArgs, ...filters }),
    ).rejects.toBeInstanceOf(v.ValiError);
    await expect(
      getSourcePackagesTotal({ distro: "ubuntu", ...filters }),
    ).rejects.toBeInstanceOf(v.ValiError);
    expect(getPublishedSources).not.toHaveBeenCalled();
    expect(getPublishedSourcesTotal).not.toHaveBeenCalled();
  });

  it.each([undefined, null, "contains"] as const)(
    "matches partial names when match is %s",
    async (match) => {
      const filters = { search: "super", match };
      await getSourcePackages({ ...listArgs, ...filters });
      await getSourcePackagesTotal({ distro: "ubuntu", ...filters });

      const expected = expect.objectContaining({
        sourceName: "super",
        exactMatch: false,
      });
      expect(getPublishedSources).toHaveBeenCalledWith("ubuntu", expected);
      expect(getPublishedSourcesTotal).toHaveBeenCalledWith("ubuntu", expected);
    },
  );

  it.each([
    [{ maintainer: "userl" }, { maintainedBy: "userl", signedBy: undefined }],
    [{ signer: "userl" }, { maintainedBy: undefined, signedBy: "userl" }],
    [
      { maintainer: "userl", signer: null },
      { maintainedBy: "userl", signedBy: null },
    ],
    [
      { maintainer: null, signer: "userl" },
      { maintainedBy: null, signedBy: "userl" },
    ],
    [
      { maintainer: "userl", signer: "userl" },
      { maintainedBy: "userl", signedBy: "userl" },
    ],
    [
      { maintainer: "userl", signer: "userl-other" },
      { maintainedBy: "userl", signedBy: "userl-other" },
    ],
    [
      { maintainer: "ubuntu-mozillateam", signer: "userl" },
      { maintainedBy: "ubuntu-mozillateam", signedBy: "userl" },
    ],
  ])(
    "passes person and team names directly to both queries with %j",
    async (filters, expected) => {
      await getSourcePackages({ ...listArgs, ...filters });
      await getSourcePackagesTotal({ distro: "ubuntu", ...filters });

      expect(getPublishedSources).toHaveBeenCalledWith(
        "ubuntu",
        expect.objectContaining(expected),
      );
      expect(getPublishedSourcesTotal).toHaveBeenCalledWith(
        "ubuntu",
        expect.objectContaining(expected),
      );
    },
  );

  it("logs filters rejected by Launchpad and returns an empty listing and total", async () => {
    const failure = new LaunchpadApiError(400, "https://lp.example");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getPublishedSources).mockRejectedValue(failure);
    vi.mocked(getPublishedSourcesTotal).mockRejectedValue(failure);

    await expect(
      getSourcePackages({ ...listArgs, series: "unknown-series" }),
    ).resolves.toEqual({ data: [], hasNext: false });
    await expect(
      getSourcePackagesTotal({ distro: "ubuntu", series: "unknown-series" }),
    ).resolves.toBe(0);
    expect(log).toHaveBeenCalledWith("Failed to load source packages", failure);
    expect(log).toHaveBeenCalledWith(
      "Failed to count source packages",
      failure,
    );
  });

  it("keeps service failures distinct from an empty result", async () => {
    const failure = new LaunchpadApiError(503, "https://lp.example");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getPublishedSources).mockRejectedValue(failure);
    vi.mocked(getPublishedSourcesTotal).mockRejectedValue(failure);

    await expect(getSourcePackages(listArgs)).rejects.toMatchObject({
      status: 503,
    });
    await expect(
      getSourcePackagesTotal({ distro: "ubuntu" }),
    ).resolves.toBeNull();
    expect(log).toHaveBeenCalledTimes(2);
  });
});

describe("package sorting", () => {
  describe.each([
    ["without a search", {}],
    ["with a partial-name search", { search: "super", match: "contains" }],
    ["with an exact-name search", { search: "superhref", match: "exact" }],
  ] as const)("%s", (_description, filters) => {
    it.each([
      [null, "none"],
      [null, "ascending"],
      [null, "descending"],
      ["series", "none"],
    ] as const)(
      "uses newest-first order for sort key %s and direction %s",
      async (sortKey, sortOrder) => {
        await getSourcePackages({
          ...listArgs,
          ...filters,
          sortKey,
          sortOrder,
        });

        expect(getPublishedSources).toHaveBeenCalledWith(
          "ubuntu",
          expect.objectContaining({ orderBy: ["-date_created"] }),
        );
      },
    );

    it.each([
      ["source-package", "ascending", "source_package_name"],
      ["source-package", "descending", "-source_package_name"],
      ["series", "ascending", "series"],
      ["series", "descending", "-series"],
      ["pocket", "ascending", "pocket"],
      ["pocket", "descending", "-pocket"],
      ["status", "ascending", "status"],
      ["status", "descending", "-status"],
    ] as const)("sorts by %s %s", async (sortKey, sortOrder, expectedOrder) => {
      await getSourcePackages({
        ...listArgs,
        ...filters,
        sortKey,
        sortOrder,
      });

      expect(getPublishedSources).toHaveBeenCalledWith(
        "ubuntu",
        expect.objectContaining({ orderBy: [expectedOrder] }),
      );
    });
  });
});
