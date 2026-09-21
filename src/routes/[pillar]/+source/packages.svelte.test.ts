import { settled, tick } from "svelte";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { DEFAULT_TABLE_VIEWS } from "$lib/modules/packages/table-views/constants.js";
import type { SourcePackagePublishingEntry } from "$lib/server/launchpad/types.js";
import Page from "./+page.svelte";
import type { getSourcePackages as remoteGetSourcePackages } from "./packages.remote.js";
import { page } from "$app/state";

type PackagesListArgs = Parameters<typeof remoteGetSourcePackages>[0];

const getSourcePackages = vi.hoisted(() =>
  vi.fn<(args: PackagesListArgs) => Promise<SourcePackagePublishingEntry[]>>(),
);
const getTableViews = vi.hoisted(() => vi.fn());

vi.mock("./packages.remote.js", () => ({
  getSourcePackages,
}));

vi.mock("$lib/modules/packages/table-views/table-views.remote.js", () => ({
  getTableViews,
}));

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

const alpha = sourcePackage("alpha");
const zulu = sourcePackage("zulu");
const initialRows = [zulu, alpha];
const baseProps = {
  params: { pillar: "ubuntu" },
  data: {},
} satisfies ComponentProps<typeof Page>;

beforeEach(() => {
  page.url.search = "";
  getSourcePackages.mockReset().mockResolvedValue(initialRows);
  getTableViews.mockReset().mockResolvedValue(DEFAULT_TABLE_VIEWS);
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
    expect(rows()).toEqual(["zulu", "alpha"]);
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
      const response = Promise.withResolvers<SourcePackagePublishingEntry[]>();
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

      response.resolve(entries);
      await expect
        .poll(rows)
        .toEqual(entries.map((entry) => entry.source_package_name));
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
