import { render } from "@canonical/svelte-ssr-test";
import { describe, expect, it } from "vitest";
import SeriesMilestones from "./SeriesMilestones.svelte";
import { seriesOverview } from "./series.fixtures.js";

describe("SeriesMilestones", () => {
  it("renders milestone links and date-only times in the supplied order", () => {
    const page = render(SeriesMilestones, {
      props: {
        milestones: seriesOverview.milestones,
        allMilestonesHref: seriesOverview.links.milestones,
      },
    });

    const rows = [...page.container.querySelectorAll("tbody tr")];
    expect(rows).toHaveLength(3);
    expect(
      rows.map((row) => ({
        name: row.querySelector("a")?.textContent.trim(),
        url: row.querySelector("a")?.getAttribute("href"),
        date: row.querySelector("time")?.getAttribute("datetime"),
      })),
    ).toEqual(seriesOverview.milestones);
    expect(rows.map((row) => row.querySelector("time")?.textContent)).toEqual(
      seriesOverview.milestones.map(({ date }) => date),
    );
    expect(
      page.getByRole("link", { name: "All milestones" }).getAttribute("href"),
    ).toBe(seriesOverview.links.milestones);
  });

  it("leaves an undated milestone's date cell empty", () => {
    const page = render(SeriesMilestones, {
      props: {
        milestones: [{ ...seriesOverview.milestones[0], date: null }],
        allMilestonesHref: seriesOverview.links.milestones,
      },
    });

    expect(page.container.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(page.container.querySelector("tbody a")?.getAttribute("href")).toBe(
      seriesOverview.milestones[0].url,
    );
    expect(
      page.container.querySelector("tbody td:last-child")?.textContent.trim(),
    ).toBe("");
    expect(page.container.querySelector("time")).toBeNull();
  });

  it("keeps the All milestones link when there are no active milestones", () => {
    const page = render(SeriesMilestones, {
      props: {
        milestones: [],
        allMilestonesHref: seriesOverview.links.milestones,
      },
    });

    expect(page.container.querySelectorAll("tbody tr")).toHaveLength(0);
    expect(
      page.getByRole("link", { name: "All milestones" }).getAttribute("href"),
    ).toBe(seriesOverview.links.milestones);
  });
});
