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
            "&signer=me&ubuntu-change=1&all-statuses=1",
        ),
      ),
    ).toEqual({
      "binary-package": null,
      sort: { key: null, direction: "none", cycle: expect.any(Function) },
      view: DEFAULT_TABLE_VIEW_SLUG,
      panel: null,
      "manage-views": { edit: null },
      search: "superhref",
      match: "exact",
      series: "stonking",
      pocket: "Updates",
      maintainer: "ubuntu-mozillateam",
      signer: "me",
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
      match: null,
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
});
