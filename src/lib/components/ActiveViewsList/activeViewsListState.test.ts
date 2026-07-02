import { describe, expect, it } from "vitest";
import {
  addItem,
  isSelected,
  moveItem,
  orderItems,
  removeItem,
  toggleItem,
} from "./activeViewsListState.js";
import type { ActiveViewsListItem } from "./activeViewsListState.js";

const a: ActiveViewsListItem = { id: "a", text: "A" };
const b: ActiveViewsListItem = { id: "b", text: "B" };
const c: ActiveViewsListItem = { id: "c", text: "C" };

describe("activeViewsListState", () => {
  it("isSelected reports membership by id", () => {
    expect(isSelected([a, b], "a")).toBe(true);
    expect(isSelected([a, b], "c")).toBe(false);
  });

  it("addItem appends, but never duplicates an existing id", () => {
    expect(addItem([a], b)).toEqual([a, b]);
    expect(addItem([a, b], { id: "a", text: "A renamed" })).toEqual([a, b]);
  });

  it("removeItem drops the matching id only", () => {
    expect(removeItem([a, b, c], "b")).toEqual([a, c]);
    expect(removeItem([a], "missing")).toEqual([a]);
  });

  describe("toggleItem", () => {
    it("adds when absent", () => {
      expect(toggleItem([a], b)).toEqual([a, b]);
    });

    it("removes when present", () => {
      expect(toggleItem([a, b], b)).toEqual([a]);
    });
  });

  describe("orderItems", () => {
    it("reorders to follow the id list", () => {
      expect(orderItems([a, b, c], ["c", "a", "b"])).toEqual([c, a, b]);
    });

    it("ignores unknown ids and appends items missing from the list", () => {
      expect(orderItems([a, b, c], ["c", "zzz"])).toEqual([c, a, b]);
    });

    it("is a no-op for an empty id list", () => {
      expect(orderItems([a, b], [])).toEqual([a, b]);
    });
  });

  describe("moveItem", () => {
    it("moves an item down", () => {
      expect(moveItem([a, b, c], 0, 2)).toEqual([b, c, a]);
    });

    it("moves an item up", () => {
      expect(moveItem([a, b, c], 2, 0)).toEqual([c, a, b]);
    });

    it("returns a copy unchanged for no-op or out-of-range indices", () => {
      expect(moveItem([a, b], 0, 0)).toEqual([a, b]);
      expect(moveItem([a, b], 0, 5)).toEqual([a, b]);
      expect(moveItem([a, b], -1, 1)).toEqual([a, b]);
    });
  });
});
