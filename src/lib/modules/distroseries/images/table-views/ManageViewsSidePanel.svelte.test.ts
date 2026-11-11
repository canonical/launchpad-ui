import { error } from "@sveltejs/kit";
import { SvelteURL } from "svelte/reactivity";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { DEFAULT_IMAGES_FILTERS } from "../filters/constants.js";
import type { TableView } from "./constants.js";
import { getTableViews, updateTableViews } from "./table-views.remote.js";
import ManageViewsSidePanel from "./test.fixtures.svelte";
import { goto } from "$app/navigation";
import { page } from "$app/state";

const url = new SvelteURL("https://launchpad.test/ubuntu/+source");

vi.mock("$app/state", () => ({
  page: {
    get url() {
      return url;
    },
    state: {},
  },
}));

vi.mock("$app/navigation", async () => {
  const { page } = await import("$app/state");
  return {
    // Imported by SvelteKit's root component, which the remote functions client runtime pulls in
    afterNavigate: vi.fn(),
    goto: vi.fn(
      async (
        href: string,
        opts?: { state?: App.PageState; shallow?: boolean },
      ) => {
        if (!opts?.shallow) url.href = new URL(href, url).href;
        page.state = opts?.state ?? {};
      },
    ),
  };
});

vi.mock("../context.js", async () => {
  const { QueryParams } = await import("../superhref.js");
  return {
    getImagesContext: () => ({
      distro: "ubuntu",
      get queryParams() {
        return QueryParams.bind(new URL(url.href));
      },
    }),
  };
});

vi.mock("./table-views.remote.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./table-views.remote.js")>()),
  getTableViews: vi.fn(() => tableViews.query()),
  updateTableViews: vi.fn(),
}));

let tableViews: FakeTableViews;

const allImages = view("all-images", "All images", false);
const failedToBuild = view("failed-to-build", "Failed to build");
const failedTesting = view("failed-testing", "Failed testing");

beforeEach(() => {
  tableViews = new FakeTableViews();
  tableViews.current = [allImages, failedToBuild, failedTesting];
  page.state = {};
  vi.mocked(updateTableViews).mockReset();
  vi.mocked(getTableViews).mockClear();
  vi.mocked(goto).mockClear();
});

describe("ManageViewsSidePanel", () => {
  it("only enables Save once something is staged", async () => {
    const screen = await renderPanel();
    const save = screen.getByRole("button", { name: "Save" });

    await expect.element(save).toBeDisabled();
    await screen
      .getByRole("button", { name: "Delete Failed to build" })
      .click();
    await expect.element(save).toBeEnabled();
  });

  it("loads the views of the context's distro", async () => {
    await renderPanel();

    expect(vi.mocked(getTableViews).mock.calls).not.toHaveLength(0);
    expect(
      vi.mocked(getTableViews).mock.calls.every(([arg]) => arg === "ubuntu"),
    ).toBe(true);
  });

  it("saves the staged order, settings and deletions", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allImages]);
    const screen = await renderPanel();

    const reorder = screen.getByRole("button", {
      name: "Reorder Failed to build",
    });
    // WebKit on macOS doesn't focus buttons on click, so focus the handle directly.
    (reorder.element() as HTMLElement).focus();
    await userEvent.keyboard("{Enter}{ArrowUp}{ArrowUp}{Enter}");
    await editName(screen, "Failed to build", "Failed to build 2");
    await screen.getByRole("button", { name: "Delete Failed testing" }).click();
    navigate(hrefOf(screen.getByRole("link", { name: "Add new view" })));
    await screen.getByRole("textbox", { name: "* View name" }).fill("Mine");
    await screen.getByRole("button", { name: "Confirm" }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    await expect
      .poll(() => vi.mocked(updateTableViews).mock.calls)
      .toEqual([
        [
          {
            distro: "ubuntu",
            views: [
              {
                id: "failed-to-build",
                settings: {
                  name: "Failed to build 2",
                  filters: failedToBuild.filters,
                },
              },
              { id: "all-images", settings: undefined },
              { settings: { name: "Mine", filters: DEFAULT_IMAGES_FILTERS } },
            ],
          },
        ],
      ]);
  });

  it("bookmarks the URL filters as a new view", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allImages]);
    const screen = await renderPanel(
      "?images.product=kubuntu&images.build-status=successful" +
        "&panel=manage-views&manage-views.add=bookmark",
    );
    const name = "Kubuntu + Successful";

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue(name);
    await screen.getByRole("button", { name: "Confirm" }).click();
    await expect
      .poll(() => viewNames(screen))
      .toEqual(["All images", "Failed to build", "Failed testing", name]);
    await screen.getByRole("button", { name: "Save" }).click();

    await expect
      .poll(() => vi.mocked(updateTableViews).mock.calls)
      .toEqual([
        [
          {
            distro: "ubuntu",
            views: [
              { id: "all-images", settings: undefined },
              { id: "failed-to-build", settings: undefined },
              { id: "failed-testing", settings: undefined },
              {
                settings: {
                  name,
                  filters: {
                    ...DEFAULT_IMAGES_FILTERS,
                    product: "kubuntu",
                    buildStatus: "successful",
                  },
                },
              },
            ],
          },
        ],
      ]);
  });

  it("goes to the renamed current view with the saved views", async () => {
    const saved = [
      allImages,
      {
        ...failedToBuild,
        name: "Failed to build 2",
        slug: "failed-to-build-2",
      },
    ];
    vi.mocked(updateTableViews).mockResolvedValue(saved);
    const screen = await renderPanel(
      "?images.view=failed-to-build&images.page=3&panel=manage-views",
    );

    await editName(screen, "Failed to build", "Failed to build 2");
    await screen.getByRole("button", { name: "Save" }).click();

    const [href, options] = await savedNavigation();
    const params = new URL(href, url).searchParams;
    expect(params.get("images.view")).toBe("failed-to-build-2");
    expect(params.get("images.page")).toBe("3");
    expect(params.has("panel")).toBe(false);
    expect(options?.state).toEqual({ imageTableViews: saved });
    expect(tableViews.set).toHaveBeenCalledWith(saved);
    expect(page.state).toEqual({});
  });

  it("resets the page when the current view is deleted", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([allImages, failedTesting]);
    const screen = await renderPanel(
      "?images.view=failed-to-build&images.page=3&panel=manage-views",
    );

    await screen
      .getByRole("button", { name: "Delete Failed to build" })
      .click();
    await screen.getByRole("button", { name: "Save" }).click();

    const [href] = await savedNavigation();
    const params = new URL(href, url).searchParams;
    expect(params.has("images.view")).toBe(false);
    expect(params.get("images.page") ?? "1").toBe("1");
  });

  it("keeps the current view and page when new views are added", async () => {
    vi.mocked(updateTableViews).mockResolvedValue([
      allImages,
      failedToBuild,
      failedTesting,
      view("first", "First"),
      view("second", "Second"),
    ]);
    const screen = await renderPanel(
      "?images.view=failed-to-build&images.page=3&panel=manage-views",
    );

    await addView(screen, "First");
    await addView(screen, "Second");
    await screen.getByRole("button", { name: "Save" }).click();

    const [href] = await savedNavigation();
    const params = new URL(href, url).searchParams;
    expect(params.get("images.view")).toBe("failed-to-build");
    expect(params.get("images.page")).toBe("3");
  });

  it("goes to a bookmarked view without the URL filters", async () => {
    const name = "Kubuntu + Successful";
    vi.mocked(updateTableViews).mockResolvedValue([
      allImages,
      failedToBuild,
      failedTesting,
      view("bookmarked", name),
      view("extra", "Extra"),
    ]);
    const screen = await renderPanel(
      "?images.sort=name&images.product=kubuntu&images.build-status=successful" +
        "&images.page=3&panel=manage-views&manage-views.add=bookmark",
    );

    await screen.getByRole("button", { name: "Confirm" }).click();
    await addView(screen, "Extra");
    await expect.poll(() => viewNames(screen)).toContain(name);
    await screen.getByRole("button", { name: "Save" }).click();

    const [href] = await savedNavigation();
    expect(href).toBe("?images.sort=name&images.view=bookmarked");
  });

  it("keeps the current view and filters when a staged bookmark is removed", async () => {
    const name = "Kubuntu + Successful";
    vi.mocked(updateTableViews).mockResolvedValue([
      allImages,
      failedToBuild,
      failedTesting,
      view("extra", "Extra"),
    ]);
    const screen = await renderPanel(
      "?images.sort=name&images.product=kubuntu&images.build-status=successful" +
        "&images.page=3&images.view=failed-to-build&panel=manage-views&manage-views.add=bookmark",
    );

    await screen.getByRole("button", { name: "Confirm" }).click();
    await addView(screen, "Extra");
    await screen.getByRole("button", { name: `Delete ${name}` }).click();
    await screen.getByRole("button", { name: "Save" }).click();

    const [href] = await savedNavigation();
    const params = new URL(href, url).searchParams;
    expect(params.get("images.view")).toBe("failed-to-build");
    expect(params.get("images.page")).toBe("3");
    expect(params.get("images.sort")).toBe("name");
    expect(params.get("images.product")).toBe("kubuntu");
    expect(params.get("images.build-status")).toBe("successful");
  });

  it("discards staged changes on Cancel", async () => {
    const screen = await renderPanel();

    await screen
      .getByRole("button", { name: "Delete Failed to build" })
      .click();
    expect(viewNames(screen)).toEqual(["All images", "Failed testing"]);
    await cancel(screen);
    navigate("?panel=manage-views");

    await expect
      .poll(() => viewNames(screen))
      .toEqual(["All images", "Failed to build", "Failed testing"]);
    await expect
      .element(screen.getByRole("button", { name: "Save" }))
      .toBeDisabled();
  });

  it("reopens straight into editing with the saved settings", async () => {
    const screen = await renderPanel();
    const editHref = hrefOf(
      screen.getByRole("link", { name: "Edit Failed to build", exact: true }),
    );

    await editName(screen, "Failed to build", "Failed to build 2");
    await cancel(screen);
    navigate(editHref);

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue("Failed to build");
  });

  it("reports a failed save and reloads the latest views", async () => {
    vi.mocked(updateTableViews).mockImplementation(() => {
      error(400, "Unknown table view");
    });
    tableViews.latest = [allImages, view("other", "Other")];
    const screen = await renderPanel();

    await screen
      .getByRole("button", { name: "Delete Failed to build" })
      .click();
    await screen.getByRole("button", { name: "Save" }).click();

    const alert = screen.getByRole("alert");
    await expect
      .element(alert)
      .toHaveTextContent("Couldn't save the views: Unknown table view.");
    expect(goto).not.toHaveBeenCalled();

    await screen.getByRole("button", { name: "Reload views" }).click();

    await expect.element(alert).not.toBeInTheDocument();
    expect(tableViews.refresh).toHaveBeenCalledOnce();
    await expect.poll(() => viewNames(screen)).toEqual(["All images", "Other"]);
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
    filters: { ...DEFAULT_IMAGES_FILTERS },
  };
}

/** Navigates the way the SvelteKit router would. */
function navigate(href: string) {
  url.href = new URL(href, url).href;
  page.state = {};
}

/** Waits for a save to clear the page state, then returns the navigation that applied it. */
async function savedNavigation() {
  const calls = () => vi.mocked(goto).mock.calls;
  await expect
    .poll(() => calls().filter(([, opts]) => opts?.shallow).length)
    .toBe(1);
  const params = calls().findLast(([, opts]) => !opts?.shallow);
  assert(params);
  return params;
}

function hrefOf(link: Locator) {
  return link.element().getAttribute("href")!;
}

async function renderPanel(search = "?panel=manage-views") {
  url.href = `https://launchpad.test/ubuntu/+source${search}`;
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

async function addView(screen: Screen, name: string) {
  navigate(hrefOf(screen.getByRole("link", { name: "Add new view" })));
  await screen.getByRole("textbox", { name: "* View name" }).fill(name);
  await screen.getByRole("button", { name: "Confirm" }).click();
  await expect.poll(() => viewNames(screen)).toContain(name);
}
