import { error } from "@sveltejs/kit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
import type { TableView } from "./constants.js";
import { updateTableViews } from "./table-views.remote.js";
import ManageViewsSidePanel from "./test.fixtures.svelte";
import { goto, replaceState } from "$app/navigation";
import { page } from "$app/state";

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: {
      url: new SvelteURL("https://launchpad.test/ubuntu/+source"),
      state: {},
    },
  };
});

vi.mock("$app/navigation", async () => {
  const { page } = await import("$app/state");
  return {
    goto: vi.fn(async (url: string, opts?: { state?: App.PageState }) => {
      page.url.href = new URL(url, page.url).href;
      page.state = opts?.state ?? {};
    }),
    replaceState: vi.fn((_url: string, state: App.PageState) => {
      page.state = state;
    }),
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
  getPersonByName: vi.fn(() => Promise.resolve(null)),
}));

vi.mock("./table-views.remote.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./table-views.remote.js")>()),
  getTableViews: () => tableViews.query(),
  updateTableViews: vi.fn(),
}));

let tableViews: FakeTableViews;

const allPackages = view("all-packages", "All packages", false);
const noble = view("noble", "Noble");
const resolute = view("resolute", "Resolute");

beforeEach(() => {
  tableViews = new FakeTableViews();
  tableViews.current = [allPackages, noble, resolute];
  page.state = {};
  vi.mocked(updateTableViews).mockReset();
  vi.mocked(goto).mockClear();
  vi.mocked(replaceState).mockClear();
});

describe("ManageViewsSidePanel", () => {
  it("only enables Save once something is staged", async () => {
    const screen = await renderPanel();
    const save = screen.getByRole("button", { name: "Save" });

    await expect.element(save).toBeDisabled();
    await screen.getByRole("button", { name: "Delete Noble" }).click();
    await expect.element(save).toBeEnabled();
  });

  it("saves the staged order, settings and deletions", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allPackages]);
    const screen = await renderPanel();

    await screen.getByRole("button", { name: "Reorder Noble" }).click();
    await userEvent.keyboard("{Enter}{ArrowUp}{ArrowUp}{Enter}");
    await editName(screen, "Noble", "Noble 2");
    await screen.getByRole("button", { name: "Delete Resolute" }).click();
    navigate(hrefOf(screen.getByRole("link", { name: "Add new view" })));
    await screen.getByRole("textbox", { name: "* View name" }).fill("Mine");
    await screen.getByRole("button", { name: "Confirm" }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    await expect
      .poll(() => vi.mocked(updateTableViews).mock.calls)
      .toEqual([
        [
          [
            {
              id: "noble",
              settings: { name: "Noble 2", filters: noble.filters },
            },
            { id: "all-packages", settings: undefined },
            { settings: { name: "Mine", filters: DEFAULT_PACKAGES_FILTERS } },
          ],
        ],
      ]);
  });

  it("bookmarks the URL filters as a new view", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allPackages]);
    const screen = await renderPanel(
      "?search=linux&series=noble&ubuntu-change=1" +
        "&panel=manage-views&manage-views.add=bookmark",
    );
    const name = '"linux" + Noble + Changed by Ubuntu';

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue(name);
    await screen.getByRole("button", { name: "Confirm" }).click();
    await expect
      .poll(() => viewNames(screen))
      .toEqual(["All packages", "Noble", "Resolute", name]);
    await screen.getByRole("button", { name: "Save" }).click();

    await expect
      .poll(() => vi.mocked(updateTableViews).mock.calls)
      .toEqual([
        [
          [
            { id: "all-packages", settings: undefined },
            { id: "noble", settings: undefined },
            { id: "resolute", settings: undefined },
            {
              settings: {
                name,
                filters: {
                  ...DEFAULT_PACKAGES_FILTERS,
                  search: "linux",
                  series: "noble",
                  ubuntuChange: true,
                },
              },
            },
          ],
        ],
      ]);
  });

  it("goes to the renamed current view with the saved views", async () => {
    const saved = [allPackages, { ...noble, name: "Noble 2", slug: "noble-2" }];
    vi.mocked(updateTableViews).mockResolvedValue(saved);
    const screen = await renderPanel("?view=noble&page=3&panel=manage-views");

    await editName(screen, "Noble", "Noble 2");
    await screen.getByRole("button", { name: "Save" }).click();

    await expect.poll(() => vi.mocked(replaceState).mock.calls.length).toBe(1);
    const [url, options] = vi.mocked(goto).mock.lastCall!;
    const params = new URL(url as string, page.url).searchParams;
    expect(params.get("view")).toBe("noble-2");
    expect(params.get("page")).toBe("3");
    expect(params.has("panel")).toBe(false);
    expect(options?.state).toEqual({ tableViews: saved });
    expect(tableViews.set).toHaveBeenCalledWith(saved);
    expect(page.state).toEqual({});
  });

  it("resets the page when the current view is deleted", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allPackages, resolute]);
    const screen = await renderPanel("?view=noble&page=3&panel=manage-views");

    await screen.getByRole("button", { name: "Delete Noble" }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    await expect.poll(() => vi.mocked(replaceState).mock.calls.length).toBe(1);
    const [url] = vi.mocked(goto).mock.lastCall!;
    const params = new URL(url as string, page.url).searchParams;
    expect(params.has("view")).toBe(false);
    expect(params.get("page") ?? "1").toBe("1");
  });

  it("discards staged changes on Cancel", async () => {
    const screen = await renderPanel();

    await screen.getByRole("button", { name: "Delete Noble" }).click();
    expect(viewNames(screen)).toEqual(["All packages", "Resolute"]);
    await cancel(screen);
    navigate("?panel=manage-views");

    await expect
      .poll(() => viewNames(screen))
      .toEqual(["All packages", "Noble", "Resolute"]);
    await expect
      .element(screen.getByRole("button", { name: "Save" }))
      .toBeDisabled();
  });

  it("reopens straight into editing with the saved settings", async () => {
    const screen = await renderPanel();
    const editHref = hrefOf(
      screen.getByRole("link", { name: "Edit Noble", exact: true }),
    );

    await editName(screen, "Noble", "Noble 2");
    await cancel(screen);
    navigate(editHref);

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue("Noble");
  });

  it("reports a failed save and reloads the latest views", async () => {
    vi.mocked(updateTableViews).mockImplementation(() => {
      error(400, "Unknown table view");
    });
    tableViews.latest = [allPackages, view("other", "Other")];
    const screen = await renderPanel();

    await screen.getByRole("button", { name: "Delete Noble" }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    const alert = screen.getByRole("alert");
    await expect
      .element(alert)
      .toHaveTextContent("Couldn't save the views: Unknown table view.");
    expect(goto).not.toHaveBeenCalled();

    await screen.getByRole("button", { name: "Reload views" }).click();

    await expect.element(alert).not.toBeInTheDocument();
    expect(tableViews.refresh).toHaveBeenCalledOnce();
    await expect
      .poll(() => viewNames(screen))
      .toEqual(["All packages", "Other"]);
    await expect
      .element(screen.getByRole("button", { name: "Save" }))
      .toBeDisabled();
  });
});

class FakeTableViews {
  current = $state<TableView[]>([]);
  /** What the server returns on refresh. */
  latest: TableView[] = [];

  refresh = vi.fn(async () => {
    this.current = this.latest;
  });

  set = vi.fn((views: TableView[]) => {
    this.current = views;
  });

  query() {
    const promise = Promise.resolve(this.current);
    const current = () => this.current;
    return {
      then: promise.then.bind(promise),
      get current() {
        return current();
      },
      loading: false,
      refresh: this.refresh,
      set: this.set,
    };
  }
}

function view(id: string, name: string, editable = true): TableView {
  return {
    id,
    name,
    slug: id,
    editable,
    filters: { ...DEFAULT_PACKAGES_FILTERS, series: editable ? id : null },
  };
}

/** Navigates the way the SvelteKit router would. */
function navigate(href: string) {
  page.url.href = new URL(href, page.url).href;
  page.state = {};
}

function hrefOf(link: Locator) {
  return link.element().getAttribute("href")!;
}

async function renderPanel(search = "?panel=manage-views") {
  page.url.href = `https://launchpad.test/ubuntu/+source${search}`;
  const screen = await render(ManageViewsSidePanel);
  await expect.element(screen.getByText("Active views")).toBeVisible();
  return screen;
}

type Screen = Awaited<ReturnType<typeof renderPanel>>;

function viewNames(screen: Screen) {
  return screen
    .getByRole("button", { name: /^Reorder / })
    .elements()
    .map((handle) =>
      handle.getAttribute("aria-label")!.slice("Reorder ".length),
    );
}

async function cancel(screen: Screen) {
  await screen.getByRole("button", { name: "Cancel" }).last().click();
  await expect.element(screen.getByRole("dialog")).not.toBeInTheDocument();
}

async function editName(screen: Screen, from: string, to: string) {
  navigate(
    hrefOf(screen.getByRole("link", { name: `Edit ${from}`, exact: true })),
  );
  await screen.getByRole("textbox", { name: "* View name" }).fill(to);
  await screen.getByRole("button", { name: "Confirm" }).click();
}
