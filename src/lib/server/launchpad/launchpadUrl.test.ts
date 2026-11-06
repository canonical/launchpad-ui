import { describe, expect, it, vi } from "vitest";
import { launchpadApiBaseUrl, launchpadUrl } from "./launchpadUrl.js";

// TODO: Reduce repeated env mocks (https://warthogs.atlassian.net/browse/LP-5132)
vi.mock(
  "$app/env/private",
  () =>
    ({
      MAIN_LAUNCHPAD_BASE_HOST: "https://launchpad.invalid",
    }) satisfies Partial<typeof import("$app/env/private")>,
);

describe("launchpadApiBaseUrl", () => {
  it("points at the API root of the configured host", () => {
    expect(launchpadApiBaseUrl).toBe("https://launchpad.invalid/api/devel/");
  });
});

describe("launchpadUrl", () => {
  it.each([
    [["ubuntu", "noble"], "ubuntu/noble"],
    [["~", "userl"], "~userl"],
    [["ubuntu", "+", "archive", "primary"], "ubuntu/+archive/primary"],
    [["~", "a/b c"], "~a%2Fb%20c"],
  ])("links %j under the configured API root", async (segments, path) => {
    expect(launchpadUrl(...segments)).toBe(
      `https://launchpad.invalid/api/devel/${path}`,
    );
  });

  it.each([
    ["ubuntu", null],
    ["~", undefined],
  ])("returns undefined when a segment is missing: %j", async (...segments) => {
    expect(launchpadUrl(...segments)).toBeUndefined();
  });

  it.each([".", ".."])(
    "rejects the dot segment %s instead of leaving the API root",
    async (segment) => {
      expect(() => launchpadUrl(segment, "x")).toThrow(TypeError);
    },
  );
});
