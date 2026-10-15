import { isHttpError, isRedirect, isValidationError } from "@sveltejs/kit";
import * as v from "valibot";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { tableViewsStore } from "$lib/server/table-views/index.js";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
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
  url: new URL("https://launchpad.test/ubuntu/+source"),
  setTableViews: vi.fn(),
}));

// Kit checks that every export of a remote module carries `__`
vi.mock("$app/server", () => ({
  query: (handler: () => Promise<unknown>) =>
    Object.assign(
      () => Object.assign(handler(), { set: mocks.setTableViews }),
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

// Kit's remote form type isn't callable, but the mock above makes it so
function submit(remoteForm: object, data: unknown) {
  return (remoteForm as (data: unknown) => Promise<unknown>)(data);
}

function storedViews() {
  return tableViewsStore.get(mocks.userId);
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

const [allPackages, resolutePackages] = DEFAULT_TABLE_VIEWS;

const nobleFilters = { ...DEFAULT_PACKAGES_FILTERS, series: "noble" };

const mine: TableView = {
  id: "mine",
  name: "Mine",
  slug: "mine",
  editable: true,
  filters: DEFAULT_PACKAGES_FILTERS,
};

beforeEach(async () => {
  mocks.url = new URL("https://launchpad.test/ubuntu/+source");
  mocks.setTableViews.mockReset();
  await tableViewsStore.set(mocks.userId, [...DEFAULT_TABLE_VIEWS, mine]);
});

describe("getTableViews", () => {
  it("returns the stored views", async () => {
    await expect(getTableViews()).resolves.toEqual([
      ...DEFAULT_TABLE_VIEWS,
      mine,
    ]);
  });
});

describe("deleteTableView", () => {
  it("deletes an editable view", async () => {
    await submit(deleteTableView, { id: mine.id });

    expect(await storedViews()).toEqual(DEFAULT_TABLE_VIEWS);
    expect(mocks.setTableViews).toHaveBeenCalledWith(DEFAULT_TABLE_VIEWS);
  });

  it("ignores a view that is already gone", async () => {
    await submit(deleteTableView, { id: "gone" });

    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });

  it("refuses to delete a view that is not editable", async () => {
    await expect(
      submit(deleteTableView, { id: allPackages.id }),
    ).rejects.toSatisfy(
      expectHttpError(400, "This table view cannot be deleted"),
    );
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });

  it("switches to the default view when deleting the current one", async () => {
    mocks.url = new URL("https://launchpad.test/ubuntu/+source?view=mine");

    await expect(submit(deleteTableView, { id: mine.id })).rejects.toSatisfy(
      isRedirect,
    );
    expect(await storedViews()).toEqual(DEFAULT_TABLE_VIEWS);
  });
});

describe("editTableView", () => {
  it("saves the settings and closes the form", async () => {
    mocks.url = new URL(
      "https://launchpad.test/ubuntu/+source?panel=manage-views&manage-views.edit=mine",
    );

    await expect(
      submit(editTableView, {
        id: mine.id,
        name: "Mine",
        filters: { series: "noble" },
      }),
    ).rejects.toSatisfy(expectRedirect("?panel=manage-views"));
    expect(await storedViews()).toContainEqual({
      ...mine,
      filters: nobleFilters,
    });
  });

  it("gives a renamed view a slug not taken by another view", async () => {
    await expect(
      submit(editTableView, { id: mine.id, name: "All packages" }),
    ).rejects.toSatisfy(isRedirect);
    expect(await storedViews()).toContainEqual({
      ...mine,
      name: "All packages",
      slug: "all-packages-2",
    });
  });

  it("follows the rename of the current view", async () => {
    mocks.url = new URL("https://launchpad.test/ubuntu/+source?view=mine");

    await expect(
      submit(editTableView, { id: mine.id, name: "Ours" }),
    ).rejects.toSatisfy(expectRedirect("?view=ours"));
  });

  it("keeps the submitted values without saving for a person search", async () => {
    await expect(
      submit(editTableView, {
        id: mine.id,
        intent: "search-maintainer",
        maintainerSearch: "userl",
        name: "Unsaved",
      }),
    ).rejects.toSatisfy(isValidationError);
    expect(await storedViews()).toContainEqual(mine);
  });

  it.each([
    [{ id: "gone", name: "Gone" }, 404, "This table view no longer exists"],
    [
      { id: allPackages.id, name: "Everything" },
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
      "https://launchpad.test/ubuntu/+source?panel=manage-views&manage-views.add=new",
    );

    await expect(
      submit(createTableView, {
        name: "Mine",
        filters: { series: "noble" },
      }),
    ).rejects.toSatisfy(expectRedirect("?panel=manage-views"));
    expect(await storedViews()).toEqual([
      ...DEFAULT_TABLE_VIEWS,
      mine,
      {
        id: expect.any(String),
        name: "Mine",
        slug: "mine-2",
        editable: true,
        filters: nobleFilters,
      },
    ]);
  });

  it("keeps the submitted values without creating a view for a person search", async () => {
    await expect(
      submit(createTableView, {
        intent: "search-signer",
        signerSearch: "userl",
        name: "Unsaved",
      }),
    ).rejects.toSatisfy(isValidationError);
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
  });
});

describe("updateTableViews", () => {
  it("reorders and deletes views", async () => {
    const savedViews = await updateTableViews([
      { id: mine.id },
      { id: allPackages.id },
    ]);

    expect(savedViews).toEqual([mine, allPackages]);
    expect(await storedViews()).toEqual(savedViews);
    expect(mocks.setTableViews).toHaveBeenCalledWith(savedViews);
  });

  it("edits views, keeping the slug unless renamed", async () => {
    const savedViews = await updateTableViews([
      { id: allPackages.id },
      {
        id: resolutePackages.id,
        settings: { name: resolutePackages.name, filters: nobleFilters },
      },
      { id: mine.id, settings: { name: "Ours", filters: mine.filters } },
    ]);

    expect(savedViews).toEqual([
      allPackages,
      { ...resolutePackages, filters: nobleFilters },
      { ...mine, name: "Ours", slug: "ours" },
    ]);
  });

  it("creates views where they are placed", async () => {
    const savedViews = await updateTableViews([
      { id: allPackages.id },
      { settings: { name: "New", filters: nobleFilters } },
      { id: mine.id },
    ]);

    expect(savedViews).toEqual([
      allPackages,
      {
        id: expect.any(String),
        name: "New",
        slug: "new",
        editable: true,
        filters: nobleFilters,
      },
      mine,
    ]);
  });

  it("doesn't let new or renamed views take a kept slug", async () => {
    const savedViews = await updateTableViews([
      { settings: { name: "Mine", filters: nobleFilters } },
      {
        id: resolutePackages.id,
        settings: { name: "All packages", filters: resolutePackages.filters },
      },
      { id: allPackages.id },
      { id: mine.id },
    ]);

    expect(savedViews.map(({ slug }) => slug)).toEqual([
      "mine-2",
      "all-packages-2",
      "all-packages",
      "mine",
    ]);
  });

  it("gives new views with the same name distinct slugs", async () => {
    const savedViews = await updateTableViews([
      { id: allPackages.id },
      { settings: { name: "New", filters: nobleFilters } },
      { settings: { name: "New", filters: nobleFilters } },
    ]);

    expect(savedViews.map(({ slug }) => slug)).toEqual([
      "all-packages",
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
    await expect(updateTableViews(views)).rejects.toSatisfy(
      expectHttpError(400, message),
    );
    expect(await storedViews()).toEqual([...DEFAULT_TABLE_VIEWS, mine]);
    expect(mocks.setTableViews).not.toHaveBeenCalled();
  });
});
