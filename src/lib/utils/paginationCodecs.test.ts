import { describe, expect, it } from "vitest";
import { paginationCodecs } from "./paginationCodecs";

const { page, "page-size": size } = paginationCodecs({
  defaultSize: 25,
  maxSize: 100,
});

describe("paginationCodecs", () => {
  describe("page", () => {
    it.each([
      ["1", 1],
      ["2", 2],
      ["3827", 3827],
    ])("parses %j as page %i", (raw, expected) => {
      expect(page.parse(raw)).toBe(expected);
    });

    it.each([null, "", "0", "-3", "1.5", "abc"])(
      "parses %j as the first page",
      (raw) => {
        expect(page.parse(raw)).toBe(1);
      },
    );

    it("serializes the first page as an absent key", () => {
      expect(page.serialize(1)).toBeNull();
      expect(page.serialize(null)).toBeNull();
    });

    it("round-trips other pages", () => {
      expect(page.serialize(page.parse("7"))).toBe("7");
    });
  });

  describe("page-size", () => {
    it.each([
      ["10", 10],
      ["36", 36],
      ["100", 100],
    ])("parses %j as size %i", (raw, expected) => {
      expect(size.parse(raw)).toBe(expected);
    });

    it("caps the size at the maximum", () => {
      expect(size.parse("500")).toBe(100);
    });

    it.each([null, "", "0", "-3", "2.5", "abc"])(
      "parses %j as the default size",
      (raw) => {
        expect(size.parse(raw)).toBe(25);
      },
    );

    it("serializes the default size as an absent key", () => {
      expect(size.serialize(25)).toBeNull();
      expect(size.serialize(null)).toBeNull();
    });

    it("round-trips other sizes", () => {
      expect(size.serialize(size.parse("36"))).toBe("36");
    });
  });
});
