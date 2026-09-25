import { settled, tick } from "svelte";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { DEFAULT_TABLE_VIEWS } from "$lib/modules/packages/table-views/constants.js";
import type { SourcePackagePublishingEntry } from "$lib/server/launchpad/types.js";
import Page from "./+page.svelte";
import type { getSourcePackages as getSourcePackagesQuery } from "./packages.remote.js";
import { page } from "$app/state";

type PackagesListArgs = Parameters<typeof getSourcePackagesQuery>[0];
type PackagesListing = Awaited<ReturnType<typeof getSourcePackagesQuery>>;

const getSourcePackages = vi.hoisted(() =>
  vi.fn<(args: PackagesListArgs) => Promise<PackagesListing>>(),
);
const getSourcePackagesTotal = vi.hoisted(() =>
  vi.fn<
    (args: { distro: string; series?: string }) => Promise<number | null>
  >(),
);
const getTableViews = vi.hoisted(() =>
  vi.fn<() => Promise<typeof DEFAULT_TABLE_VIEWS>>(),
);

vi.mock("./packages.remote.js", () => ({
  getSourcePackages,
  getSourcePackagesTotal,
}));

vi.mock("$lib/modules/packages/table-views/table-views.remote.js", () => ({
  getTableViews,
}));

vi.mock(
  "$lib/modules/packages/table-views/ManageViewsSidePanel.svelte",
  () => ({
    default: vi.fn(),
  }),
);

vi.mock(
  "$lib/modules/packages/binary-package/BinaryPackageSidePanel.svelte",
  () => ({ default: vi.fn() }),
);

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: {
      url: new SvelteURL("https://launchpad.test/ubuntu/+source"),
    },
  };
});

function sourcePackage(name: string): SourcePackagePublishingEntry {
  return {
    self_link: `https://launchpad.test/api/devel/ubuntu/+archive/primary/+sourcepub/${name}`,
    resource_type_link:
      "https://launchpad.test/api/devel/#source_package_publishing_history",
    display_name: name,
    source_package_name: name,
    source_package_version: "1.0",
    status: "Published",
    pocket: "Release",
    component_name: "main",
    section_name: null,
    distro_series_link: "https://launchpad.test/api/devel/ubuntu/resolute",
    archive_link: "https://launchpad.test/api/devel/ubuntu/+archive/primary",
    date_published: null,
    date_created: "2026-09-01T00:00:00Z",
    date_superseded: null,
    date_made_pending: null,
    date_removed: null,
  };
}

function listing(
  entries: SourcePackagePublishingEntry[],
  overrides: Partial<PackagesListing> = {},
): PackagesListing {
  return { data: entries, hasNext: false, ...overrides };
}

function deferredQuery<T>(onStart: () => void) {
  const response = Promise.withResolvers<T>();
  let started = false;
  const start = () => {
    if (!started) {
      started = true;
      onStart();
    }
    return response.promise;
  };
  const query: Promise<T> & { readonly loading: boolean } = {
    get loading() {
      start();
      return true;
    },
    then: (onfulfilled, onrejected) => start().then(onfulfilled, onrejected),
    catch: (onrejected) => start().catch(onrejected),
    finally: (onfinally) => start().finally(onfinally),
    [Symbol.toStringTag]: "Promise",
  };
  return { query, resolve: response.resolve };
}

function submittedParams(container: Element): Promise<Record<string, string>> {
  const submitted = Promise.withResolvers<Record<string, string>>();
  container.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    submitted.resolve(
      Object.fromEntries(
        Array.from(new FormData(form), ([name, value]) => [
          name,
          String(value),
        ]),
      ),
    );
  });
  return submitted.promise;
}

const alpha = sourcePackage("alpha");
const zulu = sourcePackage("zulu");
const initialRows = [zulu, alpha];
const baseProps = {
  params: { pillar: "ubuntu" },
  data: {},
} satisfies ComponentProps<typeof Page>;

beforeEach(() => {
  page.url.search = "";
  getSourcePackages.mockReset().mockResolvedValue(listing(initialRows));
  getSourcePackagesTotal.mockReset().mockResolvedValue(40);
  getTableViews.mockReset().mockResolvedValue(DEFAULT_TABLE_VIEWS);
});

describe("packages queries", () => {
  it("starts the listing, total, and table views before any query resolves", async () => {
    const started = new Set<string>();
    const packages = deferredQuery<PackagesListing>(() =>
      started.add("packages"),
    );
    const total = deferredQuery<number | null>(() => started.add("total"));
    const views = deferredQuery<typeof DEFAULT_TABLE_VIEWS>(() =>
      started.add("views"),
    );
    getSourcePackages.mockReturnValueOnce(packages.query);
    getSourcePackagesTotal.mockReturnValueOnce(total.query);
    getTableViews.mockReturnValueOnce(views.query);

    const rendering = render(Page, { ...baseProps });
    try {
      await expect
        .poll(() => Array.from(started).sort())
        .toEqual(["packages", "total", "views"]);
    } finally {
      packages.resolve(listing(initialRows));
      total.resolve(40);
      views.resolve(DEFAULT_TABLE_VIEWS);
      await rendering;
    }
  });
});

describe("packages table sorting", () => {
  it("updates the arrow and next-sort link with the loaded rows throughout the sort cycle", async () => {
    const screen = await render(Page, { ...baseProps });
    const header = screen.getByRole("columnheader", {
      name: "Source package",
      exact: true,
    });
    const link = header.getByRole("link");
    const rows = () =>
      Array.from(screen.container.querySelectorAll("tbody th"), (row) =>
        row.textContent?.trim(),
      );
    const headerState = () => ({
      direction: header.element().getAttribute("aria-sort"),
      href: link.element().getAttribute("href"),
      label: link.element().getAttribute("aria-label"),
      icon: link.element().querySelector("symbol")?.innerHTML,
    });

    await expect.element(header).toHaveAttribute("aria-sort", "none");
    expect(rows()).toEqual(["zulu - 1.0", "alpha - 1.0"]);
    const unsortedIcon = headerState().icon;
    expect(unsortedIcon).toBeTruthy();
    expect(link.element().querySelector("symbol path")).not.toBeNull();
    expect(
      link.element().querySelector('g[id="arrow-up"], g[id="arrow-down"]'),
    ).toBeNull();
    expect(headerState()).toEqual({
      direction: "none",
      href: "?sort=source-package",
      label: "Sort by Source package ascending",
      icon: unsortedIcon,
    });

    for (const { search, direction, next, label, arrowId, entries } of [
      {
        search: "?sort=source-package",
        direction: "ascending",
        next: "?sort=-source-package",
        label: "Sort by Source package descending",
        arrowId: "arrow-up",
        entries: [alpha, zulu],
      },
      {
        search: "?sort=-source-package",
        direction: "descending",
        next: "?",
        label: "Remove sorting by Source package",
        arrowId: "arrow-down",
        entries: [zulu, alpha],
      },
      {
        search: "?",
        direction: "none",
        next: "?sort=source-package",
        label: "Sort by Source package ascending",
        arrowId: null,
        entries: [alpha, zulu],
      },
    ]) {
      const previousHeader = headerState();
      const previousRows = rows();
      const response = Promise.withResolvers<PackagesListing>();
      getSourcePackages.mockReturnValueOnce(response.promise);

      expect(previousHeader.href).toBe(search);
      page.url.search = search;

      await expect
        .poll(() => getSourcePackages.mock.lastCall?.[0])
        .toMatchObject({
          sortKey: direction === "none" ? null : "source-package",
          sortOrder: direction,
        });
      await tick();
      expect(headerState()).toEqual(previousHeader);
      expect(rows()).toEqual(previousRows);

      response.resolve(listing(entries));
      await expect
        .poll(rows)
        .toEqual(
          entries.map(
            (entry) =>
              `${entry.source_package_name} - ${entry.source_package_version}`,
          ),
        );
      const { icon, ...currentHeader } = headerState();
      expect(currentHeader).toEqual({
        direction,
        href: next,
        label,
      });
      if (arrowId) {
        expect(link.element().querySelector("symbol g")?.id).toBe(arrowId);
        expect(icon).not.toBe(unsortedIcon);
      } else {
        expect(icon).toBe(unsortedIcon);
      }
    }
  });

  it("moves the active arrow when sorting by another column", async () => {
    page.url.search = "?sort=source-package";
    const screen = await render(Page, { ...baseProps });
    const sourceHeader = screen.getByRole("columnheader", {
      name: "Source package",
      exact: true,
    });
    await expect
      .element(sourceHeader)
      .toHaveAttribute("aria-sort", "ascending");

    for (const [key, label] of [
      ["series", "Series"],
      ["pocket", "Pocket"],
      ["status", "Status"],
    ]) {
      page.url.search = `?sort=${key}`;
      await settled();

      const header = screen.getByRole("columnheader", {
        name: label,
        exact: true,
      });
      await expect.element(header).toHaveAttribute("aria-sort", "ascending");
      await expect
        .element(header.getByRole("link"))
        .toHaveAttribute("href", `?sort=-${key}`);
      expect(
        header.getByRole("link").element().querySelector('g[id="arrow-up"]'),
      ).not.toBeNull();
      expect(
        screen.container.querySelectorAll('thead g[id="arrow-up"]'),
      ).toHaveLength(1);
      expect(
        screen.container.querySelectorAll('th[aria-sort="ascending"]'),
      ).toHaveLength(1);
      await expect.element(sourceHeader).toHaveAttribute("aria-sort", "none");
    }

    await expect
      .element(
        screen.getByRole("columnheader", {
          name: "Binary packages",
          exact: true,
        }),
      )
      .not.toHaveAttribute("aria-sort");
  });
});

describe("packages pagination", () => {
  it("renders the total with the same distro and series as the listing", async () => {
    page.url.search = "?series=stonking";
    const screen = await render(Page, { ...baseProps });

    await expect
      .element(screen.getByText("Showing 2 of 40 items"))
      .toBeVisible();
    await expect.element(screen.getByText("of 2 Pages")).toBeVisible();
    expect(getSourcePackagesTotal).toHaveBeenCalledWith({
      distro: "ubuntu",
      series: "stonking",
    });
    expect(getSourcePackages.mock.lastCall?.[0]).toMatchObject({
      distro: "ubuntu",
      series: "stonking",
    });
  });

  it("shows the counts without a total when the count failed", async () => {
    getSourcePackagesTotal.mockResolvedValue(null);
    const screen = await render(Page, { ...baseProps });

    await expect.element(screen.getByText("Showing 2 items")).toBeVisible();
    await expect.element(screen.getByText("of many Pages")).toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Go to last page" }))
      .not.toBeInTheDocument();
  });

  it("links the navigation to the neighbouring pages and keeps the other params", async () => {
    page.url.search = "?sort=series&page=3";
    getSourcePackages.mockResolvedValue(
      listing(initialRows, { hasNext: true }),
    );
    getSourcePackagesTotal.mockResolvedValue(100);
    const screen = await render(Page, { ...baseProps });

    await expect
      .element(screen.getByText("Showing 2 of 100 items"))
      .toBeVisible();
    expect(getSourcePackages.mock.lastCall?.[0]).toMatchObject({
      page: 3,
      size: 25,
    });
    await expect.element(screen.getByRole("spinbutton")).toHaveValue(3);
    for (const [name, href] of [
      ["Go to first page", "?sort=series"],
      ["Go to previous page", "?sort=series&page=2"],
      ["Go to next page", "?sort=series&page=4"],
      ["Go to last page", "?sort=series&page=4"],
    ]) {
      await expect
        .element(screen.getByRole("link", { name }))
        .toHaveAttribute("href", href);
    }
  });

  it("disables the navigation at the edges", async () => {
    const screen = await render(Page, { ...baseProps });

    await expect
      .element(screen.getByText("Showing 2 of 40 items"))
      .toBeVisible();
    for (const name of [
      "Go to first page",
      "Go to previous page",
      "Go to next page",
    ]) {
      await expect
        .element(screen.getByRole("link", { name }))
        .toHaveAttribute("aria-disabled", "true");
    }
    await expect
      .element(screen.getByRole("link", { name: "Go to last page" }))
      .toHaveAttribute("href", "?page=2");
  });

  it("drops the page from sort links", async () => {
    page.url.search = "?page=3";
    const screen = await render(Page, { ...baseProps });

    await expect
      .element(
        screen
          .getByRole("columnheader", { name: "Series", exact: true })
          .getByRole("link"),
      )
      .toHaveAttribute("href", "?sort=series");
  });

  it("submits a new page size as a GET form without the page", async () => {
    page.url.search = "?sort=series&page=3";
    const screen = await render(Page, { ...baseProps });
    await expect
      .element(screen.getByText("Showing 2 of 40 items"))
      .toBeVisible();
    const submitted = submittedParams(screen.container);

    await screen.getByLabelText("Items per page:").selectOptions("50");

    expect(await submitted).toEqual({ sort: "series", "page-size": "50" });
  });

  it("submits a typed page as a GET form keeping the page size", async () => {
    page.url.search = "?page-size=50";
    getSourcePackagesTotal.mockResolvedValue(400);
    const screen = await render(Page, { ...baseProps });
    await expect
      .element(screen.getByText("Showing 2 of 400 items"))
      .toBeVisible();
    const submitted = submittedParams(screen.container);

    const input = screen.getByRole("spinbutton");
    await input.fill("4");
    await userEvent.keyboard("{Enter}");

    expect(await submitted).toEqual({ "page-size": "50", page: "4" });
  });

  it("keeps the no-JS submit buttons out of the scripted page", async () => {
    const screen = await render(Page, { ...baseProps });
    await expect
      .element(screen.getByText("Showing 2 of 40 items"))
      .toBeVisible();

    expect(screen.container.querySelectorAll("noscript")).toHaveLength(2);
    expect(screen.container.querySelectorAll("form button")).toHaveLength(0);
  });

  it("submits the default page size as an absent key", async () => {
    page.url.search = "?sort=series&page=3&page-size=50";
    const screen = await render(Page, { ...baseProps });
    await expect
      .element(screen.getByText("Showing 2 of 40 items"))
      .toBeVisible();
    const submitted = submittedParams(screen.container);

    await screen.getByLabelText("Items per page:").selectOptions("25");

    expect(await submitted).toEqual({ sort: "series" });
  });

  it("submits the first page as an absent key", async () => {
    page.url.search = "?page-size=50&sort=series&page=3";
    getSourcePackagesTotal.mockResolvedValue(400);
    const screen = await render(Page, { ...baseProps });
    await expect
      .element(screen.getByText("Showing 2 of 400 items"))
      .toBeVisible();
    const submitted = submittedParams(screen.container);

    const input = screen.getByRole("spinbutton");
    await input.fill("1");
    await userEvent.keyboard("{Enter}");

    expect(await submitted).toEqual({ "page-size": "50", sort: "series" });
  });
});
