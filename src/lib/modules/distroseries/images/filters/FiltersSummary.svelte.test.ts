import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { TableView } from "../table-views/constants.js";
import FiltersSummary from "./FiltersSummary.svelte";
import { DEFAULT_IMAGES_FILTERS } from "./constants.js";
import type { ImagesFilters } from "./schema.js";

vi.mock("../context.js", async () => {
  const { QueryParams } = await import("../superhref.js");
  const queryParams = QueryParams.bind(
    new URL(
      "https://launchpad.test/ubuntu/series/noble/images?images.view=mine",
    ),
  );
  return { getImagesContext: () => ({ queryParams }) };
});

describe("FiltersSummary", () => {
  it("lists only the active filters", async () => {
    const page = await renderSummary({
      product: "ubuntu",
      buildStatus: "failed",
      testStatus: "passed",
    });

    expect(filterTexts(page)).toEqual([
      "Product: ubuntu",
      "Build status: failed",
      "Test status: passed",
    ]);

    await page.rerender({ tableView: view({ buildStatus: "failed" }) });

    expect(filterTexts(page)).toEqual(["Build status: failed"]);
  });

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
    const page = await renderSummary({ buildStatus: "failed" });

    const href = page
      .getByRole("link", { name: "Edit Mine view" })
      .element()
      .getAttribute("href")!;
    const params = new URL(
      href,
      "https://launchpad.test/ubuntu/series/noble/images",
    ).searchParams;
    expect(params.get("images.view")).toBe("mine");
    expect(params.get("panel")).toBe("manage-views");
    expect(params.get("manage-views.edit")).toBe("mine-id");
  });

  it("doesn't offer to edit a view that is not editable", async () => {
    const page = await renderSummary({ buildStatus: "failed" }, false);

    await expect
      .element(page.getByRole("list", { name: "Saved view filters" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("link", { name: /^Edit/ }))
      .not.toBeInTheDocument();
  });
});

function view(filters: Partial<ImagesFilters>, editable = true): TableView {
  return {
    id: "mine-id",
    name: "Mine",
    slug: "mine",
    editable,
    filters: { ...DEFAULT_IMAGES_FILTERS, ...filters },
  };
}

function renderSummary(filters: Partial<ImagesFilters>, editable = true) {
  return render(FiltersSummary, { tableView: view(filters, editable) });
}

function filterTexts(page: Awaited<ReturnType<typeof renderSummary>>) {
  return page
    .getByRole("list", { name: "Saved view filters" })
    .getByRole("listitem")
    .elements()
    .map((item) => item.textContent.trim());
}
