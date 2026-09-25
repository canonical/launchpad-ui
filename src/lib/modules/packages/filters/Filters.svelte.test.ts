import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Filters from "./Filters.svelte";
import { page } from "$app/state";

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: { url: new SvelteURL("https://launchpad.test/ubuntu/+source") },
  };
});

vi.mock("../context.js", async () => {
  const { QueryParams } = await import("../superhref.js");
  const { page } = await import("$app/state");
  return {
    getPackagesContext: () => ({
      get queryParams() {
        return QueryParams.bind(page.url);
      },
    }),
  };
});

vi.mock("$lib/modules/packages/people.remote.js", () => ({
  findPeople: vi.fn(() => Promise.resolve([])),
  getPersonByName: vi.fn((name: string) =>
    Promise.resolve({
      name,
      display_name: `Display ${name}`,
      is_team: false,
      mugshot_link: "",
    }),
  ),
}));

function submittedParams(container: Element): Promise<Record<string, string>> {
  const submitted = Promise.withResolvers<Record<string, string>>();
  container.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted.resolve(
      Object.fromEntries(
        new FormData(event.target as HTMLFormElement),
      ) as Record<string, string>,
    );
  });
  return submitted.promise;
}

describe("Filters", () => {
  it("reflects the URL filters in the controls", async () => {
    page.url.search =
      "?search=linux&match=exact&maintainer=alice&signer=bob&series=noble" +
      "&pocket=Proposed&all-statuses=1";
    const screen = await render(Filters);

    await expect
      .element(screen.getByRole("searchbox", { name: "Search packages" }))
      .toHaveValue("linux");
    for (const name of [
      "Search mode: Exact Match",
      "Maintained by: Display alice",
      "Signed by: Display bob",
      "Series: 24.04 LTS (Noble Numbat)",
      "Pocket: Proposed",
      "More filters: 1 active",
    ]) {
      await expect.element(screen.getByRole("button", { name })).toBeVisible();
    }
  });

  it.each([
    ["Series", "radio", "24.04 LTS (Noble Numbat)", { series: "noble" }],
    ["Pocket", "radio", "Updates", { pocket: "Updates" }],
    ["Search mode", "radio", "Exact Match", { match: "exact" }],
    [
      "More filters",
      "switch",
      "Only show packages changed by Ubuntu",
      { "ubuntu-change": "1" },
    ],
  ] as const)(
    "applies the %s filter on the first page, keeping other params",
    async (trigger, role, name, applied) => {
      page.url.search = "?sort=series&pocket=Release&page=3&page-size=50";
      const screen = await render(Filters);
      const submitted = submittedParams(screen.container);

      await screen
        .getByRole("button", { name: new RegExp(`^${trigger}:`) })
        .click();
      await screen.getByRole(role, { name }).click();

      expect(await submitted).toEqual({
        sort: "series",
        pocket: "Release",
        match: "contains",
        "page-size": "50",
        ...applied,
      });
    },
  );

  it("applies the search on Enter", async () => {
    page.url.search = "?page=3";
    const screen = await render(Filters);
    const submitted = submittedParams(screen.container);

    await screen
      .getByRole("searchbox", { name: "Search packages" })
      .fill("  linux  ");
    await userEvent.keyboard("{Enter}");

    expect(await submitted).toEqual({ search: "linux", match: "contains" });
  });

  it("clears every filter except the search mode and returns to the first page", async () => {
    page.url.search =
      "?sort=series&search=linux&match=exact&maintainer=alice&signer=bob" +
      "&series=noble&pocket=Proposed&ubuntu-change=1&all-statuses=1&page=3";
    const screen = await render(Filters);

    await expect
      .element(screen.getByRole("link", { name: "Clear all filters" }))
      .toHaveAttribute("href", "?sort=series&match=exact");
  });

  it.each([
    ["no filters", ""],
    ["only a search mode", "?match=exact"],
  ])("does not offer to clear %s", async (_, search) => {
    page.url.search = search;
    const screen = await render(Filters);

    await expect
      .element(screen.getByRole("button", { name: /^Series:/ }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Clear all filters" }))
      .not.toBeInTheDocument();
  });
});
