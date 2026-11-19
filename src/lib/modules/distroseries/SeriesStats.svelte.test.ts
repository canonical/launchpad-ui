import type { ComponentProps } from "svelte";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import SeriesStats from "./SeriesStats.svelte";

type SeriesArgs = Pick<ComponentProps<typeof SeriesStats>, "distro" | "series">;

const imageCounts = {
  total: 41,
  building: { total: 41, successful: 35, failed: 2, running: 4 },
  testing: { total: 35, passed: 35, failed: 0, running: 0 },
};
const bugCounts = { open: 58, critical: 0, inProgress: 16 };
const args = { distro: "ubuntu", series: "resolute" } satisfies SeriesArgs;
const COULD_NOT_LOAD = "Couldn't load";

const { getSeriesStatsImageCounts, getSeriesBugCounts } = vi.hoisted(() => ({
  getSeriesStatsImageCounts:
    vi.fn<(args: SeriesArgs) => Promise<typeof imageCounts | null>>(),
  getSeriesBugCounts: vi.fn<(args: SeriesArgs) => Promise<typeof bugCounts>>(),
}));

vi.mock("./images/images.remote.js", () => ({ getSeriesStatsImageCounts }));
vi.mock("./bugs/bugs.remote.js", () => ({ getSeriesBugCounts }));

beforeEach(() => {
  getSeriesStatsImageCounts.mockReset().mockResolvedValue(imageCounts);
  getSeriesBugCounts.mockReset().mockResolvedValue(bugCounts);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SeriesStats", () => {
  it("loads both sources and renders known counts in order", async () => {
    const page = await render(SeriesStats, args);

    await expect.element(page.getByText("Images built")).toBeVisible();
    await expect.element(page.getByText("Open bugs")).toBeVisible();
    expect(getSeriesStatsImageCounts).toHaveBeenCalledExactlyOnceWith(args);
    expect(getSeriesBugCounts).toHaveBeenCalledExactlyOnceWith(args);
    expect(
      page
        .getByRole("definition")
        .elements()
        .map((item) => item.textContent),
    ).toEqual(["35/41", "2", "4", "35/35", "0", "0", "0", "58", "16"]);
    expect(
      page
        .getByRole("img")
        .elements()
        .map((dot) => dot.getAttribute("aria-label")),
    ).toEqual(["Attention", "No issues", "No issues"]);
  });

  it.each([
    {
      source: "images",
      query: getSeriesStatsImageCounts,
      details: [...new Array<string>(6).fill(COULD_NOT_LOAD), "0", "58", "16"],
      dots: ["Attention", "Attention", "No issues"],
    },
    {
      source: "bugs",
      query: getSeriesBugCounts,
      details: [
        ...["35/41", "2", "4", "35/35", "0", "0"],
        ...new Array<string>(3).fill(COULD_NOT_LOAD),
      ],
      dots: ["Attention", "No issues", "Attention"],
    },
  ])(
    "keeps every stat of the failed $source source with couldn't load",
    async ({ query, details, dots }) => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      query.mockRejectedValue(new Error("Source unavailable"));
      const page = await render(SeriesStats, args);

      await expect.element(page.getByText("Images built")).toBeVisible();
      await expect.element(page.getByText("Open bugs")).toBeVisible();
      expect(
        page
          .getByRole("definition")
          .elements()
          .map((item) => item.textContent),
      ).toEqual(details);
      expect(
        page
          .getByRole("img")
          .elements()
          .map((dot) => dot.getAttribute("aria-label")),
      ).toEqual(dots);
    },
  );

  it("does not request or display image stats for other distributions", async () => {
    const series = { distro: "debian", series: "sid" };
    const page = await render(SeriesStats, series);

    await expect.element(page.getByText("Open bugs")).toBeVisible();
    expect(getSeriesStatsImageCounts).not.toHaveBeenCalled();
    expect(getSeriesBugCounts).toHaveBeenCalledExactlyOnceWith(series);
    await expect
      .element(page.getByText("Images built"))
      .not.toBeInTheDocument();
  });

  it("keeps unknown image results distinct from retrieval errors", async () => {
    getSeriesStatsImageCounts.mockResolvedValue({
      ...imageCounts,
      building: { total: 0, successful: 0, failed: 0, running: 0 },
      testing: { total: 0, passed: 0, failed: 0, running: 0 },
    });
    const page = await render(SeriesStats, args);

    await expect.element(page.getByText("Images built")).toBeVisible();
    expect(page.getByText("<not defined>").elements()).toHaveLength(6);
    expect(
      page.getByRole("img", { name: "Attention" }).elements(),
    ).toHaveLength(2);
    await expect
      .element(page.getByRole("img", { name: "No issues" }))
      .toBeVisible();
    expect(page.getByText(COULD_NOT_LOAD).elements()).toHaveLength(0);
  });

  it("resets a failed boundary when the series changes", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getSeriesBugCounts.mockRejectedValueOnce(new Error("Source unavailable"));
    const page = await render(SeriesStats, args);

    await expect.element(page.getByText(COULD_NOT_LOAD).first()).toBeVisible();
    await page.rerender({ series: "noble" });

    await expect.element(page.getByText("58", { exact: true })).toBeVisible();
    expect(page.getByText(COULD_NOT_LOAD).elements()).toHaveLength(0);
    expect(getSeriesBugCounts).toHaveBeenLastCalledWith({
      distro: "ubuntu",
      series: "noble",
    });
  });
});
