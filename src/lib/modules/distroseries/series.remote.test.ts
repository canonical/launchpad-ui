import * as v from "valibot";
import { describe, expect, it, vi } from "vitest";
import { seriesOverview } from "./series.fixtures.js";
import { getSeriesOverview } from "./series.remote.js";

vi.mock("$app/server", () => ({
  query: (schema: v.GenericSchema, handler: (args: unknown) => unknown) =>
    Object.assign(async (args: unknown) => handler(v.parse(schema, args)), {
      __: { type: "query" },
    }),
}));

describe("series overview query", () => {
  it("returns the hardcoded overview for Ubuntu Resolute", async () => {
    await expect(
      getSeriesOverview({ pillar: "ubuntu", series: "resolute" }),
    ).resolves.toEqual(seriesOverview);
  });

  it.each([
    { pillar: "ubuntu", series: "unknown" },
    { pillar: "debian", series: "resolute" },
  ])("returns 404 for an unsupported series: %j", async (args) => {
    await expect(getSeriesOverview(args)).rejects.toMatchObject({
      status: 404,
      body: { message: "Series not found" },
    });
  });

  it.each([
    { pillar: "", series: "resolute" },
    { pillar: "Invalid Name", series: "resolute" },
    { pillar: "ubuntu", series: "" },
    { pillar: "ubuntu", series: "Invalid Name" },
  ])("rejects invalid query arguments: %j", async (args) => {
    await expect(getSeriesOverview(args)).rejects.toBeInstanceOf(v.ValiError);
  });
});
