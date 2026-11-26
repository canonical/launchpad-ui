import * as v from "valibot";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSeriesAdminLinks } from "./admin.remote.js";

const { getCurrentUserTeams } = vi.hoisted(() => ({
  getCurrentUserTeams: vi.fn<() => Promise<Set<string>>>(),
}));

vi.mock("#lib/modules/current-user/current-user.remote.js", () => ({
  getCurrentUserTeams,
}));

vi.mock("$app/server", () => ({
  query: (schema: v.GenericSchema, handler: (args: unknown) => unknown) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

vi.mock(
  "$app/env/private",
  () =>
    ({
      MAIN_LAUNCHPAD_BASE_HOST: "https://lp.example",
      MAIN_LAUNCHPAD_COOKIE_NAME: "lp",
      MAIN_LAUNCHPAD_IP_ADDRESS: undefined,
      MAIN_LAUNCHPAD_SKIP_TLS_VERIFY: false,
      TEST_OBSERVER_IMAGE_ARTIFACTS_URL:
        "https://observer.example/v1/artefacts?family=image",
    }) satisfies typeof import("$app/env/private"),
);

const EDIT_PAGE = "https://lp.example/ubuntu/resolute/+edit";
const ADMIN_PAGE = "https://lp.example/ubuntu/resolute/+admin";
const series = { distro: "ubuntu", series: "resolute" };

beforeEach(() => {
  getCurrentUserTeams.mockReset().mockResolvedValue(new Set());
});

describe("getSeriesAdminLinks returns links to the series admin pages", () => {
  it("Returns +admin and +edit links for Launchpad admins", async () => {
    getCurrentUserTeams.mockResolvedValue(new Set(["admins"]));

    await expect(getSeriesAdminLinks(series)).resolves.toEqual({
      changeDetails: EDIT_PAGE,
      administer: ADMIN_PAGE,
    });
  });

  it("Returns only the +admin link for registry experts", async () => {
    getCurrentUserTeams.mockResolvedValue(new Set(["registry"]));

    await expect(getSeriesAdminLinks(series)).resolves.toEqual({
      changeDetails: undefined,
      administer: ADMIN_PAGE,
    });
  });

  it("Returns {} for members of other teams, including distribution owners", async () => {
    getCurrentUserTeams.mockResolvedValue(
      new Set(["techboard", "ubuntu-release"]),
    );

    await expect(getSeriesAdminLinks(series)).resolves.toEqual({
      changeDetails: undefined,
      administer: undefined,
    });
  });

  it("Returns {} for visitors who aren't logged in", async () => {
    await expect(getSeriesAdminLinks(series)).resolves.toEqual({
      changeDetails: undefined,
      administer: undefined,
    });
  });
});
