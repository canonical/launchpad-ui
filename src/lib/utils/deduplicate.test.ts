import { describe, expect, it } from "vitest";
import { deduplicate } from "./deduplicate.js";

describe("deduplicate", () => {
  it("keeps the first item for each property value", () => {
    const first = { id: "same", value: 1 };
    const duplicate = { id: "same", value: 2 };
    const other = { id: "other", value: 3 };

    expect(deduplicate([first, duplicate, other], "id")).toEqual([
      first,
      other,
    ]);
  });

  it("accepts readonly arrays", () => {
    const items = [{ id: 1 }, { id: 1 }] as const;

    expect(deduplicate(items, "id")).toEqual([items[0]]);
  });
});
