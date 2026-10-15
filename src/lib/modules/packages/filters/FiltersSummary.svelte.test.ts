import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { TableView } from "../table-views/constants.js";
import FiltersSummary from "./FiltersSummary.svelte";
import { DEFAULT_PACKAGES_FILTERS } from "./constants.js";
import type { PackagesFilters } from "./schema.js";

vi.mock("../context.js", async () => {
  const { QueryParams } = await import("../superhref.js");
  const queryParams = QueryParams.bind(
    new URL("https://launchpad.test/ubuntu/+source?view=mine"),
  );
  return { getPackagesContext: () => ({ queryParams }) };
});

describe("FiltersSummary", () => {
  it("lists only the active filters", async () => {
    const page = await renderSummary({
      maintainer: "alice",
      signer: "bob",
      series: "noble",
      pocket: "Updates",
      ubuntuChange: true,
      allStatuses: true,
    });

    expect(filterTexts(page)).toEqual([
      "Maintained by: alice",
      "Signed by: bob",
      "Series: noble",
      "Pocket: Updates",
      "Changed by Ubuntu",
      "All statuses",
    ]);

    await page.rerender({ tableView: view({ series: "noble" }) });

    expect(filterTexts(page)).toEqual(["Series: noble"]);
  });

  it.each([
    ["contains", "Contain"],
    ["exact", "Exact Match"],
  ] as const)(
    "shows the search with its %s mode first",
    async (match, label) => {
      const page = await renderSummary({
        search: "linux",
        match,
        pocket: "Updates",
      });

      expect(filterTexts(page)).toEqual([
        `${label}: "linux"`,
        "Pocket: Updates",
      ]);
    },
  );

  it("shows no list without active filters", async () => {
    const page = await renderSummary({});

    await expect
      .element(page.getByRole("link", { name: "Edit Mine view" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("list", { name: "Saved view filters" }))
      .not.toBeInTheDocument();
  });

  it("links an editable view to its edit form", async () => {
    const page = await renderSummary({ series: "noble" });

    const href = page
      .getByRole("link", { name: "Edit Mine view" })
      .element()
      .getAttribute("href")!;
    const params = new URL(href, "https://launchpad.test/ubuntu/+source")
      .searchParams;
    expect(params.get("view")).toBe("mine");
    expect(params.get("panel")).toBe("manage-views");
    expect(params.get("manage-views.edit")).toBe("mine-id");
  });

  it("doesn't offer to edit a view that is not editable", async () => {
    const page = await renderSummary({ series: "noble" }, false);

    await expect
      .element(page.getByRole("list", { name: "Saved view filters" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("link", { name: /^Edit/ }))
      .not.toBeInTheDocument();
  });
});

function view(filters: Partial<PackagesFilters>, editable = true): TableView {
  return {
    id: "mine-id",
    name: "Mine",
    slug: "mine",
    editable,
    filters: { ...DEFAULT_PACKAGES_FILTERS, ...filters },
  };
}

function renderSummary(filters: Partial<PackagesFilters>, editable = true) {
  return render(FiltersSummary, { tableView: view(filters, editable) });
}

function filterTexts(page: Awaited<ReturnType<typeof renderSummary>>) {
  return page
    .getByRole("list", { name: "Saved view filters" })
    .getByRole("listitem")
    .elements()
    .map((item) => item.textContent.trim());
}
