import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import SeriesStats from "./SeriesStats.svelte";

describe("SeriesStats", () => {
  it("renders known counts and distinguishes zero failures from missing results", async () => {
    const page = await render(SeriesStats, {
      imageCounts: {
        total: 41,
        building: { total: 41, successful: 35, failed: 2, running: 4 },
        testing: { total: 35, passed: 35, failed: 0, running: 0 },
      },
      bugCounts: { open: 58, critical: 0, inProgress: 16 },
    });

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

  it("shows retrieval failures for null image and bug counts", async () => {
    const page = await render(SeriesStats, {
      imageCounts: null,
      bugCounts: null,
    });

    await expect.element(page.getByText("Images built")).toBeVisible();
    await expect.element(page.getByText("Images passed tests")).toBeVisible();
    expect(page.getByText("<cannot retrieve>").elements()).toHaveLength(9);
    expect(
      page.getByRole("img", { name: "Attention" }).elements(),
    ).toHaveLength(3);
  });

  it("omits image stats when there is no image source", async () => {
    const page = await render(SeriesStats, { bugCounts: null });

    await expect
      .element(page.getByText("Images built"))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByText("Images passed tests"))
      .not.toBeInTheDocument();
    expect(page.getByText("<cannot retrieve>").elements()).toHaveLength(3);
  });

  it("preserves valid zero bug counts when image retrieval fails", async () => {
    const page = await render(SeriesStats, {
      imageCounts: null,
      bugCounts: { open: 0, critical: 0, inProgress: 0 },
    });

    expect(page.getByText("<cannot retrieve>").elements()).toHaveLength(6);
    expect(page.getByText("0", { exact: true }).elements()).toHaveLength(3);
    await expect
      .element(page.getByRole("img", { name: "No issues" }))
      .toBeVisible();
  });

  it("distinguishes no known image results from failed bug retrieval", async () => {
    const page = await render(SeriesStats, {
      imageCounts: {
        total: 0,
        building: { total: 0, successful: 0, failed: 0, running: 0 },
        testing: { total: 0, passed: 0, failed: 0, running: 0 },
      },
      bugCounts: null,
    });

    expect(page.getByText("<not defined>").elements()).toHaveLength(6);
    expect(page.getByText("<cannot retrieve>").elements()).toHaveLength(3);
    expect(
      page.getByRole("img", { name: "Attention" }).elements(),
    ).toHaveLength(3);
  });
});
