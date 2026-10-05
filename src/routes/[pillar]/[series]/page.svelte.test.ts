import { settled } from "svelte";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { seriesOverview } from "$lib/modules/distroseries/series.fixtures.js";
import type { getSeriesOverview as getSeriesOverviewQuery } from "$lib/modules/distroseries/series.remote.js";
import Page from "./+page.svelte";

type SeriesArgs = Parameters<typeof getSeriesOverviewQuery>[0];
type SeriesOverview = Awaited<ReturnType<typeof getSeriesOverviewQuery>>;

const getSeriesOverview = vi.hoisted(() =>
  vi.fn<(args: SeriesArgs) => Promise<SeriesOverview>>(),
);

vi.mock("$lib/modules/distroseries/series.remote.js", () => ({
  getSeriesOverview,
}));

const baseProps = {
  params: { pillar: "ubuntu", series: "resolute" },
  data: {},
} satisfies ComponentProps<typeof Page>;

beforeEach(() => {
  getSeriesOverview.mockReset().mockResolvedValue(seriesOverview);
});

describe("series overview", () => {
  it("queries the route's series and renders its header", async () => {
    const page = await render(Page, baseProps);
    await expect.element(page.getByRole("heading", { level: 1 })).toBeVisible();

    expect(getSeriesOverview).toHaveBeenCalledWith(baseProps.params);
    await expect
      .element(
        page.getByRole("heading", {
          name: seriesOverview.displayName,
          level: 1,
        }),
      )
      .toBeVisible();
    await expect
      .element(page.getByText("Active Development", { exact: true }))
      .toBeVisible();
    await expect
      .element(page.getByText(seriesOverview.description))
      .toBeVisible();
    await expect
      .element(page.getByRole("region", { name: "About this series" }))
      .toHaveTextContent(seriesOverview.description);
    await expect
      .element(page.getByRole("link", { name: /More details|Show more/i }))
      .not.toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: /Show more/i }))
      .not.toBeInTheDocument();
  });

  it("renders the supplied links and milestone dates", async () => {
    const page = await render(Page, baseProps);

    for (const [name, href] of [
      ["Report a bug", seriesOverview.links.reportBug],
      ["Ask a question", seriesOverview.links.askQuestion],
      ["Help translate", seriesOverview.links.translate],
      ["Subscribe to bugs", seriesOverview.links.subscribeToBugs],
      ["All milestones", seriesOverview.links.milestones],
    ]) {
      await expect
        .element(page.getByRole("link", { name, exact: true }))
        .toHaveAttribute("href", href);
    }

    await expect
      .element(page.getByRole("navigation", { name: "Get involved" }))
      .toBeVisible();
    const milestonesTable = page.getByRole("table", { name: "Milestones" });
    for (const name of ["Milestone name", "Date"]) {
      await expect
        .element(milestonesTable.getByRole("columnheader", { name }))
        .toBeInTheDocument();
    }
    for (const milestone of seriesOverview.milestones) {
      await expect
        .element(
          page.getByRole("row", {
            name: `${milestone.name} ${milestone.date}`,
          }),
        )
        .toBeVisible();
      await expect
        .element(page.getByRole("link", { name: milestone.name, exact: true }))
        .toHaveAttribute("href", milestone.url);
    }
  });

  it("queries again and updates the overview when route parameters change", async () => {
    const page = await render(Page, baseProps);
    await expect.element(page.getByRole("heading", { level: 1 })).toBeVisible();

    getSeriesOverview.mockResolvedValueOnce({
      ...seriesOverview,
      displayName: "Another series",
      status: "Supported",
      description: "A different description.",
      milestones: [
        {
          name: "next-release",
          date: "2027-04-22",
          url: "https://launchpad.net/another-distro/+milestone/next-release",
        },
      ],
    });
    const params = { pillar: "another-distro", series: "another-series" };
    await page.rerender({ params });
    await settled();

    expect(getSeriesOverview).toHaveBeenLastCalledWith(params);
    await expect
      .element(page.getByRole("heading", { name: "Another series", level: 1 }))
      .toBeVisible();
    await expect
      .element(page.getByText("Supported", { exact: true }))
      .toBeVisible();
    await expect
      .element(page.getByText("A different description."))
      .toBeVisible();
    await expect
      .element(page.getByRole("row", { name: "next-release 2027-04-22" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("link", { name: "ubuntu-26.04", exact: true }))
      .not.toBeInTheDocument();
  });
});
