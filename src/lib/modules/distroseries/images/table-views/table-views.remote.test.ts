import { isHttpError, isRedirect } from "@sveltejs/kit";
import * as v from "valibot";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { imagesTableViewsStore } from "#lib/server/table-views/index.js";
import { DEFAULT_IMAGES_FILTERS } from "../filters/constants.js";
import { DEFAULT_TABLE_VIEWS } from "./constants.js";
import type { TableView } from "./constants.js";
import {
  createTableView,
  deleteTableView,
  editTableView,
  getTableViews,
  updateTableViews,
} from "./table-views.remote.js";

const mocks = vi.hoisted(() => ({
  userId: "user",
  url: new URL("https://launchpad.test/ubuntu/resolute"),
  setTableViews: vi.fn(),
}));

// Kit checks that every export of a remote module carries `__`
vi.mock("$app/server", () => ({
  query: (
    schema: v.GenericSchema,
    handler: (arg: unknown) => Promise<unknown>,
  ) =>
    Object.assign(
      (arg: unknown) =>
        Object.assign(handler(v.parse(schema, arg)), {
          set: (value: unknown) => mocks.setTableViews(arg, value),
        }),
      { __: { type: "query" } },
    ),
  form: (
    schema: v.GenericSchema,
    handler: (data: unknown) => Promise<unknown>,
  ) =>
    Object.assign((data: unknown) => handler(v.parse(schema, data)), {
      __: { type: "form" },
    }),
  command: (
    schema: v.GenericSchema,
    handler: (args: unknown) => Promise<unknown>,
  ) =>
    Object.assign((args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "command" },
    }),
  getRequestEvent: () => ({
    url: mocks.url,
    locals: { user: { id: mocks.userId } },
  }),
}));

const distro = "ubuntu";

// Kit's remote form type isn't callable, but the mock above makes it so
function submit(remoteForm: object, data: unknown) {
  return (remoteForm as (data: unknown) => Promise<unknown>)(data);
}

function storedViews() {
  return imagesTableViewsStore.get(mocks.userId, distro);
}

function expectRedirect(location: string) {
  return (thrown: unknown) =>
    isRedirect(thrown) && thrown.status === 303 && thrown.location === location;
}

function expectHttpError(status: number, message: string) {
  return (thrown: unknown) =>
    isHttpError(thrown) &&
    thrown.status === status &&
    thrown.body.message === message;
}

const [allPackages] = DEFAULT_TABLE_VIEWS;

const kubuntuFilters = { ...DEFAULT_IMAGES_FILTERS, product: "kubuntu" };

const mine: TableView = {
  id: "mine",
  name: "Mine",
  slug: "mine",
  editable: true,
  filters: DEFAULT_IMAGES_FILTERS,
};

const resolutePackages: TableView = {
  id: "resolute-images",
  name: "Resolute images",
  slug: "resolute-images",
  editable: true,
  filters: { ...DEFAULT_IMAGES_FILTERS },
};

beforeEach(async () => {
  mocks.url = new URL("https://launchpad.test/ubuntu/resolute");
  mocks.setTableViews.mockReset();
  await imagesTableViewsStore.set(mocks.userId, distro, [
    ...DEFAULT_TABLE_VIEWS,
    mine,
  ]);
  await imagesTableViewsStore.set(mocks.userId, "debian", DEFAULT_TABLE_VIEWS);
});

describe("getTableViews", () => {
  it("returns the stored views", async () => {
    await expect(getTableViews(distro)).resolves.toEqual([
      ...DEFAULT_TABLE_VIEWS,
      mine,
    ]);
  });

  it("keeps each distro's views separate", async () => {
    await expect(getTableViews("debian")).resolves.toEqual(DEFAULT_TABLE_VIEWS);
  });

  it("rejects an invalid distro", async () => {
    expect(() => getTableViews("not a distro")).toThrow();
  });
});

describe("deleteTableView", () => {
  it("deletes an editable view", async () => {
    await submit(deleteTableView, { distro, id: mine.id });

    expect(await storedViews()).toEqual(DEFAULT_TABLE_VIEWS);
    expect(mocks.setTableViews).toHaveBeenCalledWith(
      distro,
      DEFAULT_TABLE_VIEWS,
    );
  });

  it("ignores a view that is already gone", async () => {
    await submit(deleteTableView, { distro, id: "gone" });

    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });

  it("refuses to delete a view that is not editable", async () => {
    await expect(
      submit(deleteTableView, { distro, id: allPackages.id }),
    ).rejects.toSatisfy(
      expectHttpError(400, "This table view cannot be deleted"),
    );
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });

  it("switches to the default view when deleting the current one", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?images.view=mine",
    );

    await expect(
      submit(deleteTableView, { distro, id: mine.id }),
    ).rejects.toSatisfy(isRedirect);
    expect(await storedViews()).toEqual(DEFAULT_TABLE_VIEWS);
  });
});

describe("editTableView", () => {
  it("saves the settings and closes the form", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?panel=manage-views&manage-views.edit=mine",
    );

    await expect(
      submit(editTableView, {
        distro,
        id: mine.id,
        name: "Mine",
        filters: { product: "kubuntu" },
      }),
    ).rejects.toSatisfy(expectRedirect("?panel=manage-views"));
    expect(await storedViews()).toContainEqual({
      ...mine,
      filters: kubuntuFilters,
    });
  });

  it("gives a renamed view a slug not taken by another view", async () => {
    await expect(
      submit(editTableView, { distro, id: mine.id, name: "All images" }),
    ).rejects.toSatisfy(isRedirect);
    expect(await storedViews()).toContainEqual({
      ...mine,
      name: "All images",
      slug: "all-images-2",
    });
  });

  it("follows the rename of the current view", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?images.view=mine",
    );

    await expect(
      submit(editTableView, { distro, id: mine.id, name: "Ours" }),
    ).rejects.toSatisfy(expectRedirect("?images.view=ours"));
  });

  it("resets the page when the current view's filters change", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?images.view=mine&images.page=3&manage-views.edit=mine",
    );

    await expect(
      submit(editTableView, {
        distro,
        id: mine.id,
        name: "Mine",
        filters: { product: "kubuntu" },
      }),
    ).rejects.toSatisfy(expectRedirect("?images.view=mine"));
  });

  it("keeps the page when the current view's filters are unchanged", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?view=mine&page=3&manage-views.edit=mine",
    );

    await expect(
      submit(editTableView, { distro, id: mine.id, name: "Mine" }),
    ).rejects.toSatisfy(expectRedirect("?view=mine&page=3"));
  });

  it("keeps the page when editing a view other than the current one", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?view=resolute&page=3&manage-views.edit=mine",
    );

    await expect(
      submit(editTableView, {
        distro,
        id: mine.id,
        name: "Mine",
        filters: { series: "noble" },
      }),
    ).rejects.toSatisfy(expectRedirect("?view=resolute&page=3"));
  });

  it.each([
    [
      { distro, id: "gone", name: "Gone" },
      404,
      "This table view no longer exists",
    ],
    [
      { distro, id: allPackages.id, name: "Everything" },
      400,
      "This table view cannot be edited",
    ],
  ])("rejects %j", async (data, status, message) => {
    await expect(submit(editTableView, data)).rejects.toSatisfy(
      expectHttpError(status, message),
    );
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });
});

describe("createTableView", () => {
  it("appends an editable view with a unique slug and closes the form", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?images.view=failed-to-build&images.page=3&panel=manage-views&manage-views.add=new",
    );

    await expect(
      submit(createTableView, {
        distro,
        name: "Mine",
        filters: { product: "kubuntu" },
      }),
    ).rejects.toSatisfy((thrown) => {
      if (!isRedirect(thrown)) return false;
      const params = new URL(thrown.location, mocks.url).searchParams;
      return (
        params.get("images.view") === "failed-to-build" &&
        params.get("images.page") === "3" &&
        !params.has("images.product") &&
        params.get("panel") === "manage-views" &&
        !params.has("manage-views.add")
      );
    });
    expect(await storedViews()).toEqual([
      ...DEFAULT_TABLE_VIEWS,
      mine,
      {
        id: expect.any(String),
        name: "Mine",
        slug: "mine-2",
        editable: true,
        filters: kubuntuFilters,
      },
    ]);
  });

  it("preselects a bookmarked view and clears the URL filters", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/resolute?images.sort=name&images.product=kubuntu&images.build-status=successful&images.test-status=passed&images.page=3&panel=manage-views&manage-views.add=bookmark",
    );

    await expect(
      submit(createTableView, {
        distro,
        name: "Bookmarked",
        filters: { product: "kubuntu" },
      }),
    ).rejects.toSatisfy((thrown) => {
      if (!isRedirect(thrown)) return false;
      const params = new URL(thrown.location, mocks.url).searchParams;
      return (
        params.get("images.view") === "bookmarked" &&
        (params.get("images.page") ?? "1") === "1" &&
        params.get("images.sort") === "name" &&
        !params.has("images.product") &&
        !params.has("images.build-status") &&
        !params.has("images.test-status") &&
        params.get("panel") === "manage-views" &&
        !params.has("manage-views.add")
      );
    });
  });

  it("creates the view for the submitted distro only", async () => {
    await expect(
      submit(createTableView, { distro: "debian", name: "Trixie" }),
    ).rejects.toSatisfy(isRedirect);

    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
    expect(await imagesTableViewsStore.get(mocks.userId, "debian")).toEqual([
      ...DEFAULT_TABLE_VIEWS,
      expect.objectContaining({ name: "Trixie", slug: "trixie" }),
    ]);
  });
});

describe("updateTableViews", () => {
  it("reorders and deletes views", async () => {
    const savedViews = await updateTableViews({
      distro,
      views: [{ id: mine.id }, { id: allPackages.id }],
    });

    expect(savedViews).toEqual([mine, allPackages]);
    expect(await storedViews()).toEqual(savedViews);
    // The caller applies the views together with its navigation
    expect(mocks.setTableViews).not.toHaveBeenCalled();
  });

  it("only changes the given distro's views", async () => {
    await updateTableViews({ distro, views: [{ id: allPackages.id }] });

    expect(await storedViews()).toEqual([allPackages]);
    expect(await imagesTableViewsStore.get(mocks.userId, "debian")).toEqual(
      DEFAULT_TABLE_VIEWS,
    );
  });

  it("edits views, keeping the slug unless renamed", async () => {
    await imagesTableViewsStore.set(mocks.userId, distro, [
      allPackages,
      resolutePackages,
      mine,
    ]);
    const savedViews = await updateTableViews({
      distro,
      views: [
        { id: allPackages.id },
        {
          id: resolutePackages.id,
          settings: { name: resolutePackages.name, filters: kubuntuFilters },
        },
        { id: mine.id, settings: { name: "Ours", filters: mine.filters } },
      ],
    });

    expect(savedViews).toEqual([
      allPackages,
      { ...resolutePackages, filters: kubuntuFilters },
      { ...mine, name: "Ours", slug: "ours" },
    ]);
  });

  it("creates views where they are placed", async () => {
    const savedViews = await updateTableViews({
      distro,
      views: [
        { id: allPackages.id },
        { settings: { name: "New", filters: kubuntuFilters } },
        { id: mine.id },
      ],
    });

    expect(savedViews).toEqual([
      allPackages,
      {
        id: expect.any(String),
        name: "New",
        slug: "new",
        editable: true,
        filters: kubuntuFilters,
      },
      mine,
    ]);
  });

  it("doesn't let new or renamed views take a kept slug", async () => {
    await imagesTableViewsStore.set(mocks.userId, distro, [
      allPackages,
      resolutePackages,
      mine,
    ]);
    const savedViews = await updateTableViews({
      distro,
      views: [
        { settings: { name: "Mine", filters: kubuntuFilters } },
        {
          id: resolutePackages.id,
          settings: { name: "All images", filters: resolutePackages.filters },
        },
        { id: allPackages.id },
        { id: mine.id },
      ],
    });

    expect(savedViews.map(({ slug }) => slug)).toEqual([
      "mine-2",
      "all-images-2",
      "all-images",
      "mine",
    ]);
  });

  it("gives new views with the same name distinct slugs", async () => {
    const savedViews = await updateTableViews({
      distro,
      views: [
        { id: allPackages.id },
        { settings: { name: "New", filters: kubuntuFilters } },
        { settings: { name: "New", filters: kubuntuFilters } },
      ],
    });

    expect(savedViews.map(({ slug }) => slug)).toEqual([
      "all-images",
      "new",
      "new-2",
    ]);
    expect(savedViews[1].id).not.toBe(savedViews[2].id);
  });

  it.each([
    {
      description: "duplicate views",
      views: [{ id: allPackages.id }, { id: allPackages.id }],
      message: "Duplicate views are not allowed",
    },
    {
      description: "an unknown view",
      views: [{ id: allPackages.id }, { id: "gone" }],
      message: "Unknown table view",
    },
    {
      description: "removing a view that is not editable",
      views: [{ id: mine.id }],
      message: "Cannot remove a table view that is not editable",
    },
    {
      description: "editing a view that is not editable",
      views: [
        {
          id: allPackages.id,
          settings: { name: "Everything", filters: allPackages.filters },
        },
      ],
      message: "Cannot edit a table view that is not editable",
    },
  ])("rejects $description", async ({ views, message }) => {
    await expect(updateTableViews({ distro, views })).rejects.toSatisfy(
      expectHttpError(400, message),
    );
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
    expect(mocks.setTableViews).not.toHaveBeenCalled();
  });
});
