import { describe, expect, it } from "vitest";
import { DEFAULT_TABLE_VIEW_SLUG } from "$lib/modules/packages/table-views/constants.js";
import { QueryParams } from "./superhref";

describe("package filter query parameters", () => {
  it("parses only supported parameters and normalizes people and search text", () => {
    expect(
      QueryParams.parse(
        new URL(
          "https://example.test/ubuntu/+source?search=%20superhref%20&match=exact" +
            "&series=stonking&pocket=Updates&maintainer=~Ubuntu-MozillaTeam" +
            "&signer=userl&ubuntu-change=1&all-statuses=1",
        ),
      ),
    ).toEqual({
      "binary-package": null,
      sort: { key: null, direction: "none", cycle: expect.any(Function) },
      view: DEFAULT_TABLE_VIEW_SLUG,
      panel: null,
      "manage-views": { edit: null, add: null },
      search: "superhref",
      match: "exact",
      series: "stonking",
      pocket: "Updates",
      maintainer: "ubuntu-mozillateam",
      signer: "userl",
      "maintainer-search": null,
      "signer-search": null,
      "ubuntu-change": true,
      "all-statuses": true,
      page: 1,
      "page-size": 25,
    });
  });

  it("drops invalid filters without affecting pagination", () => {
    expect(
      QueryParams.parse(
        new URL(
          "https://example.test/ubuntu/+source?search=%20&match=wrong&series=bad%20name" +
            "&pocket=wrong&maintainer=-invalid&signer=Bad%20Name&ubuntu-change=0" +
            "&all-statuses=false&page=2&page-size=50",
        ),
      ),
    ).toMatchObject({
      search: null,
      match: "contains",
      series: null,
      pocket: null,
      maintainer: null,
      signer: null,
      "ubuntu-change": false,
      "all-statuses": false,
      page: 2,
      "page-size": 50,
    });
  });

  it.each([
    ["x", null],
    ["xx", "xx"],
  ])("applies the minimum name length to %j filters", (name, expected) => {
    expect(
      QueryParams.parse(
        new URL(
          `https://example.test/ubuntu/+source?series=${name}&maintainer=~${name}&signer=${name}`,
        ),
      ),
    ).toMatchObject({
      series: expected,
      maintainer: expected,
      signer: expected,
    });
  });
});

describe("manage views actions", () => {
  function bind(search: string) {
    return QueryParams.bind(
      new URL(`https://example.test/ubuntu/+source${search}`),
    );
  }

  it("opens a view's edit form in place of the add form", () => {
    expect(
      bind("?view=mine&page=3&manage-views.add=new").editView("mine-id"),
    ).toBe("?view=mine&page=3&panel=manage-views&manage-views.edit=mine-id");
  });

  it("opens the add form in place of an edit form", () => {
    expect(bind("?view=mine&manage-views.edit=mine-id").addView("new")).toBe(
      "?view=mine&panel=manage-views&manage-views.add=new",
    );
  });

  it.each(["manage-views.edit=mine-id", "manage-views.add=new"])(
    "closes the form opened with %s, keeping the panel open",
    (formParam) => {
      expect(
        bind(`?view=mine&panel=manage-views&${formParam}`)[
          "manage-views"
        ].closeForm(),
      ).toBe("?view=mine&panel=manage-views");
    },
  );
});
