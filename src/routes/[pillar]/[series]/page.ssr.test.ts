import type { ComponentProps } from "svelte";
import { render } from "svelte/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Page from "./+page.svelte";
import { seriesOverview } from "./series.fixtures.js";
import type { getSeriesOverview as getSeriesOverviewQuery } from "./series.remote.js";

type SeriesArgs = Parameters<typeof getSeriesOverviewQuery>[0];
type SeriesOverview = Awaited<ReturnType<typeof getSeriesOverviewQuery>>;

const getSeriesOverview = vi.hoisted(() =>
  vi.fn<(args: SeriesArgs) => Promise<SeriesOverview>>(),
);

vi.mock("./series.remote.js", () => ({ getSeriesOverview }));

const baseProps = {
  params: { pillar: "ubuntu", series: "resolute" },
  data: {},
} satisfies ComponentProps<typeof Page>;

beforeEach(() => {
  getSeriesOverview.mockReset().mockResolvedValue(seriesOverview);
});

describe("series overview SSR", () => {
  it("renders the queried series without JavaScript", async () => {
    const { body, head } = await render(Page, { props: baseProps });

    expect(getSeriesOverview).toHaveBeenCalledWith(baseProps.params);
    expect(head).toContain(
      "<title>26.04 LTS (Resolute Raccoon) - Launchpad</title>",
    );
    expect(body).toContain(seriesOverview.displayName);
    expect(body).toContain(seriesOverview.status);
    expect(body).toContain(seriesOverview.description);
    expect(body).not.toContain("More details");
    expect(body).not.toContain("Show more");
    for (const milestone of seriesOverview.milestones) {
      expect(body).toContain(milestone.name);
      expect(body).toContain(
        `<time datetime="${milestone.date}">${milestone.date}</time>`,
      );
    }
  });

  it("renders the breadcrumb trail without JavaScript", async () => {
    const { body } = await render(Page, { props: baseProps });

    expect(body).toContain('aria-label="Breadcrumbs"');
    expect(body).toMatch(/<a [^>]*href="[^"]*ubuntu"[^>]*>(<!---->)?Ubuntu/);
    expect(body).toMatch(/<span aria-current="page"[^>]*>Series<\/span>/);
  });

  it("does not render the excluded statistics", async () => {
    const { body } = await render(Page, { props: baseProps });

    expect(body).not.toContain("Images built");
    expect(body).not.toContain("Images passing tests");
    expect(body).not.toContain("Images passed tests");
    expect(body).not.toContain("Open critical bugs");
    expect(body).not.toContain("All packages");
  });

  it("propagates query failures rather than rendering placeholder success", async () => {
    getSeriesOverview.mockRejectedValueOnce(new Error("Series unavailable"));

    await expect(render(Page, { props: baseProps })).rejects.toThrow(
      "Series unavailable",
    );
  });
});
