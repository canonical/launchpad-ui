import { describe, expect, it } from "vitest";
import { QueryParams } from "./superhref";
import { DEFAULT_TABLE_VIEW_SLUG } from "./table-views/constants";

describe("package filter query parameters", () => {
  it("parses only supported parameters", () => {
    expect(
      QueryParams.parse(
        new URL(
          "https://example.test/ubuntu/resolute?images.product=kubuntu" +
            "&images.build-status=successful&images.test-status=passed",
        ),
      ),
    ).toEqual({
      panel: null,
      "manage-views": { edit: null, add: null },
      images: {
        product: "kubuntu",
        "build-status": "successful",
        "test-status": "passed",
        sort: { key: null, direction: "none", cycle: expect.any(Function) },
        view: DEFAULT_TABLE_VIEW_SLUG,
        page: 1,
        "page-size": 10,
      },
    });
  });

  it("drops invalid filters without affecting pagination", () => {
    expect(
      QueryParams.parse(
        new URL(
          "https://example.test/ubuntu/resolute?images.product=wrong" +
            "&images.build-status=wrong&images.test-status=wrong" +
            "&images.page=2&images.page-size=50",
        ),
      ),
    ).toMatchObject({
      images: {
        product: null,
        "build-status": null,
        "test-status": null,
        page: 2,
        "page-size": 50,
      },
    });
  });
});

describe("manage views actions", () => {
  function bind(search: string) {
    return QueryParams.bind(
      new URL(`https://example.test/ubuntu/resolute${search}`),
    );
  }

  it("opens a view's edit form in place of the add form", () => {
    expect(
      bind("?images.view=mine&page=3&manage-views.add=new").editView("mine-id"),
    ).toBe(
      "?images.view=mine&page=3&panel=manage-views&manage-views.edit=mine-id",
    );
  });

  it("opens the add form in place of an edit form", () => {
    expect(
      bind("?images.view=mine&manage-views.edit=mine-id").addView("new"),
    ).toBe("?images.view=mine&panel=manage-views&manage-views.add=new");
  });

  it.each(["manage-views.edit=mine-id", "manage-views.add=new"])(
    "closes the form opened with %s, keeping the panel open",
    (formParam) => {
      expect(
        bind(`?images.view=mine&panel=manage-views&${formParam}`)[
          "manage-views"
        ].closeForm(),
      ).toBe("?images.view=mine&panel=manage-views");
    },
  );
});
