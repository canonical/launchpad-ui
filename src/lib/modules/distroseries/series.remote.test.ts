import * as v from "valibot";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  activeSeriesMilestones,
  distroSeries,
  seriesOverview,
} from "./series.fixtures.js";
import { getSeriesOverview } from "./series.remote.js";

vi.mock("$app/server", () => ({
  query: (schema: v.GenericSchema, handler: (args: unknown) => unknown) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock("$env/dynamic/private", () => ({
  env: { MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example" },
}));

const launchpadFetch = vi.hoisted(() => vi.fn());
vi.mock("$lib/server/launchpad/launchpadFetch.js", () => ({ launchpadFetch }));

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function respondWith(
  series: unknown = distroSeries,
  milestones: unknown = activeSeriesMilestones,
) {
  launchpadFetch.mockImplementation(async (url: string) =>
    jsonResponse(new URL(url).searchParams.has("ws.op") ? milestones : series),
  );
}

beforeEach(() => {
  launchpadFetch.mockReset();
  respondWith();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("series overview query", () => {
  it("maps the real series and milestones with exactly two requests", async () => {
    await expect(
      getSeriesOverview({ pillar: "ubuntu", series: "resolute" }),
    ).resolves.toEqual(seriesOverview);
    expect(launchpadFetch.mock.calls.map(([url]) => url)).toEqual([
      "https://lp.example/api/devel/ubuntu/resolute",
      "https://lp.example/api/devel/ubuntu/resolute?ws.op=searchMilestones&is_active=true&order_by=date_targeted&ws.size=3",
    ]);
  });

  it("starts both requests before either response arrives", async () => {
    const series = Promise.withResolvers<Response>();
    const milestones = Promise.withResolvers<Response>();
    launchpadFetch
      .mockImplementationOnce(() => series.promise)
      .mockImplementationOnce(() => milestones.promise);

    const result = getSeriesOverview({ pillar: "ubuntu", series: "resolute" });

    expect(launchpadFetch).toHaveBeenCalledTimes(2);
    series.resolve(jsonResponse(distroSeries));
    milestones.resolve(jsonResponse(activeSeriesMilestones));
    await expect(result).resolves.toEqual(seriesOverview);
  });

  it("supports other distributions without fetching their metadata", async () => {
    respondWith(
      {
        version: "98",
        title: 'Debian "unstable"',
        status: "Active Development",
        summary: "The current development snapshot is named sid.",
        web_link: "https://launchpad.net/debian/sid",
        translations_usage: "Not Applicable",
      },
      { start: 0, entries: [] },
    );

    await expect(
      getSeriesOverview({ pillar: "debian", series: "sid" }),
    ).resolves.toEqual({
      displayName: '98 (Debian "unstable")',
      distribution: { displayName: "Debian", url: "/debian" },
      status: "Active Development",
      description: "The current development snapshot is named sid.",
      links: {
        reportBug: "https://bugs.launchpad.net/debian/+filebug",
        askQuestion: "https://answers.launchpad.net/debian/+addquestion",
        translate: undefined,
        subscribeToBugs: "https://bugs.launchpad.net/debian/sid/+subscribe",
        milestones: "https://launchpad.net/debian/sid/+milestones",
      },
      milestones: [],
    });
    expect(
      launchpadFetch.mock.calls.map(([url]) => new URL(url).pathname),
    ).toEqual(["/api/devel/debian/sid", "/api/devel/debian/sid"]);
  });

  it.each([
    ["ubuntu", "08.04", "08.04 LTS"],
    ["ubuntu", "24.04", "24.04 LTS"],
    ["ubuntu", "26.04", "26.04 LTS"],
    ["ubuntu", "25.04", "25.04"],
    ["ubuntu", "26.10", "26.10"],
    ["ubuntu", "2.04", "2.04"],
    ["ubuntu", "2026.04", "2026.04"],
    ["ubuntu", "26.4", "26.4"],
    ["ubuntu", "rolling", "rolling"],
    ["ubuntu", "26.04.1", "26.04.1"],
    ["ubuntu", "26.04-beta", "26.04-beta"],
    ["debian", "26.04", "26.04"],
  ])("formats %s version %s as %s", async (pillar, version, heading) => {
    respondWith({ ...distroSeries, version });

    const result = await getSeriesOverview({ pillar, series: "release" });

    expect(result.displayName).toBe(`${heading} (Resolute Raccoon)`);
  });

  it.each(["The Release", "Release", "Theatre", "Release of The Series"])(
    "removes only a leading 'The ' from %s",
    async (title) => {
      respondWith({ ...distroSeries, title });

      const result = await getSeriesOverview({
        pillar: "ubuntu",
        series: "resolute",
      });

      expect(result.displayName).toBe(
        `26.04 LTS (${title === "The Release" ? "Release" : title})`,
      );
    },
  );

  it("uses the returned summary, status and canonical series web path", async () => {
    respondWith({
      ...distroSeries,
      status: "Future",
      summary: "A new series summary.",
      description: "A longer description that should not be used.",
      web_link: "https://launchpad.net/example/+series/release",
    });

    const result = await getSeriesOverview({
      pillar: "example",
      series: "release",
    });

    expect(result.status).toBe("Future");
    expect(result.description).toBe("A new series summary.");
    expect(result.distribution).toEqual({
      displayName: "Example",
      url: "/example",
    });
    expect(result.links).toEqual({
      reportBug: "https://bugs.launchpad.net/example/+filebug",
      askQuestion: "https://answers.launchpad.net/example/+addquestion",
      translate: "https://translations.launchpad.net/example/+series/release",
      subscribeToBugs:
        "https://bugs.launchpad.net/example/+series/release/+subscribe",
      milestones: "https://launchpad.net/example/+series/release/+milestones",
    });
  });

  it.each(["External", "Not Applicable", "Unknown"])(
    "omits the translation link when usage is %s",
    async (translations_usage) => {
      respondWith({ ...distroSeries, translations_usage });

      const result = await getSeriesOverview({
        pillar: "ubuntu",
        series: "resolute",
      });

      expect(result.links.translate).toBeUndefined();
      expect(result.links.reportBug).toBe(seriesOverview.links.reportBug);
      expect(result.links.askQuestion).toBe(seriesOverview.links.askQuestion);
      expect(result.links.subscribeToBugs).toBe(
        seriesOverview.links.subscribeToBugs,
      );
    },
  );

  it("preserves milestone order, undated rows and web links, without paging", async () => {
    respondWith(distroSeries, {
      start: 0,
      entries: [
        {
          name: "undated",
          date_targeted: null,
          web_link: "https://launchpad.net/ubuntu/+milestone/undated",
        },
        ...activeSeriesMilestones.entries,
      ],
      next_collection_link:
        "https://lp.example/api/devel/ubuntu/resolute?ws.start=3",
    });

    const result = await getSeriesOverview({
      pillar: "ubuntu",
      series: "resolute",
    });

    expect(result.milestones).toEqual([
      {
        name: "undated",
        date: null,
        url: "https://launchpad.net/ubuntu/+milestone/undated",
      },
      ...seriesOverview.milestones.slice(0, 2),
    ]);
    expect(launchpadFetch).toHaveBeenCalledTimes(2);
  });

  it("uses a SvelteKit 404 when the series resource does not exist", async () => {
    launchpadFetch.mockImplementation(async () => jsonResponse({}, 404));

    await expect(
      getSeriesOverview({ pillar: "ubuntu", series: "unknown" }),
    ).rejects.toMatchObject({
      status: 404,
      body: { message: "Series not found" },
    });
  });

  it.each(["series", "milestones"])(
    "logs and raises a SvelteKit 503 when %s cannot be loaded",
    async (failedRequest) => {
      const log = vi.spyOn(console, "error").mockImplementation(() => {});
      launchpadFetch.mockImplementation(async (url: string) => {
        const isMilestones = new URL(url).searchParams.has("ws.op");
        return jsonResponse(
          isMilestones ? activeSeriesMilestones : distroSeries,
          isMilestones === (failedRequest === "milestones") ? 500 : 200,
        );
      });

      await expect(
        getSeriesOverview({ pillar: "ubuntu", series: "resolute" }),
      ).rejects.toMatchObject({
        status: 503,
        body: {
          message: "Couldn't load series from Launchpad. Try again shortly.",
        },
      });
      expect(log).toHaveBeenCalledWith(
        "Failed to load series overview",
        expect.objectContaining({ name: "LaunchpadApiError", status: 500 }),
      );
    },
  );

  it("logs network failures instead of returning fixture data", async () => {
    const failure = new TypeError("Connection failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    launchpadFetch.mockRejectedValue(failure);

    await expect(
      getSeriesOverview({ pillar: "ubuntu", series: "resolute" }),
    ).rejects.toMatchObject({ status: 503 });
    expect(log).toHaveBeenCalledWith("Failed to load series overview", failure);
    expect(launchpadFetch).toHaveBeenCalledTimes(2);
  });

  it.each([
    { pillar: "", series: "resolute" },
    { pillar: "Invalid Name", series: "resolute" },
    { pillar: "ubuntu", series: "" },
    { pillar: "ubuntu", series: "Invalid Name" },
    { pillar: "../ubuntu", series: "resolute" },
    { pillar: "ubuntu", series: "../resolute" },
  ])("rejects invalid query arguments: %j", async (args) => {
    await expect(getSeriesOverview(args)).rejects.toBeInstanceOf(v.ValiError);
    expect(launchpadFetch).not.toHaveBeenCalled();
  });
});
