import { describe, expect, it } from "vitest";
import { sortCodec } from "./sortCodec";

const codec = sortCodec(["name", "size", "uploaded-at"]);

describe("sortCodec", () => {
  it.each([
    ["name", { key: "name", direction: "asc" }],
    ["-name", { key: "name", direction: "desc" }],
    ["uploaded-at", { key: "uploaded-at", direction: "asc" }],
    ["-uploaded-at", { key: "uploaded-at", direction: "desc" }],
  ])("parses %j into a column and direction", (raw, expected) => {
    expect(codec.parse(raw)).toEqual(expected);
  });

  it.each([null, "", "-", "nope", "-nope", "--name", "name-", " name"])(
    "parses %j as unsorted",
    (raw) => {
      expect(codec.parse(raw)).toBeNull();
    },
  );

  it.each(["name", "-name", "-uploaded-at"])(
    "round-trips %j through serialize",
    (raw) => {
      expect(codec.serialize(codec.parse(raw))).toBe(raw);
    },
  );

  it("serializes unsorted as an absent key", () => {
    expect(codec.serialize(null)).toBeNull();
  });

  it("scopes accepted columns to the ones it was built with", () => {
    expect(sortCodec(["size"]).parse("name")).toBeNull();
    expect(sortCodec([]).parse("name")).toBeNull();
  });

  describe("cycle", () => {
    it("walks the active column through asc, desc, unsorted", () => {
      const asc = codec.cycle(null, "name");
      expect(asc).toEqual({ key: "name", direction: "asc" });
      const desc = codec.cycle(asc, "name");
      expect(desc).toEqual({ key: "name", direction: "desc" });
      expect(codec.cycle(desc, "name")).toBeNull();
    });

    it.each([
      ["asc", { key: "name", direction: "asc" } as const],
      ["desc", { key: "name", direction: "desc" } as const],
    ])("restarts at asc on another column while %s", (_, current) => {
      expect(codec.cycle(current, "size")).toEqual({
        key: "size",
        direction: "asc",
      });
    });

    it("round-trips a cycled value back through the URL encoding", () => {
      expect(codec.serialize(codec.cycle(codec.parse("name"), "name"))).toBe(
        "-name",
      );
    });
  });
});
