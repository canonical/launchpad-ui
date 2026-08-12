import { describe, expect, it } from "vitest";
import { sortCodec } from "./sortCodec";

const codec = sortCodec(["name", "size", "uploaded-at"]);

describe("sortCodec", () => {
  it.each([
    ["name", { key: "name", direction: "ascending" }],
    ["-name", { key: "name", direction: "descending" }],
    ["uploaded-at", { key: "uploaded-at", direction: "ascending" }],
    ["-uploaded-at", { key: "uploaded-at", direction: "descending" }],
  ])("parses %j into a column and direction", (raw, expected) => {
    expect(codec.parse(raw)).toMatchObject(expected);
  });

  it.each([null, "", "-", "nope", "-nope", "--name", "name-", " name"])(
    "parses %j as unsorted",
    (raw) => {
      expect(codec.parse(raw)).toMatchObject({ key: null, direction: "none" });
    },
  );

  it.each(["name", "-name", "-uploaded-at"])(
    "round-trips %j through serialize",
    (raw) => {
      expect(codec.serialize(codec.parse(raw))).toBe(raw);
    },
  );

  it("serializes unsorted as an absent key", () => {
    expect(codec.serialize(codec.parse(null))).toBeNull();
    expect(codec.serialize(null)).toBeNull();
  });

  it("scopes accepted columns to the ones it was built with", () => {
    expect(sortCodec(["size"]).parse("name")).toMatchObject({ key: null });
    expect(sortCodec([]).parse("name")).toMatchObject({ key: null });
  });

  describe("cycle", () => {
    it("walks the active column through ascending, descending, unsorted", () => {
      const ascending = codec.parse(null).cycle("name");
      expect(ascending).toMatchObject({ key: "name", direction: "ascending" });
      const descending = ascending.cycle("name");
      expect(descending).toMatchObject({
        key: "name",
        direction: "descending",
      });
      expect(descending.cycle("name")).toMatchObject({
        key: null,
        direction: "none",
      });
    });

    it.each(["name", "-name"])(
      "restarts at ascending on another column while %j",
      (raw) => {
        expect(codec.parse(raw).cycle("size")).toMatchObject({
          key: "size",
          direction: "ascending",
        });
      },
    );

    it("leaves the sort it was cycled from untouched", () => {
      const sort = codec.parse("name");
      sort.cycle("name");
      expect(sort).toMatchObject({ key: "name", direction: "ascending" });
    });

    it.each([
      [null, "name"],
      ["name", "-name"],
      ["-name", null],
    ])("serializes the step from %j as %j", (raw, expected) => {
      expect(codec.serialize(codec.parse(raw).cycle("name"))).toBe(expected);
    });
  });
});
