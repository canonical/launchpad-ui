import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { TableViewEditFormSchema } from "./schema.js";

describe("TableViewEditFormSchema", () => {
  it("requires a name to confirm", () => {
    const result = v.safeParse(TableViewEditFormSchema, {
      distro: "ubuntu",
      id: "mine",
      name: "  ",
    });

    expect(
      result.issues?.map((issue) => [v.getDotPath(issue), issue.message]),
    ).toEqual([["name", "Enter a view name"]]);
  });

  it.each(["", "Ubuntu", "a/b"])("rejects an invalid distro (%j)", (distro) => {
    const result = v.safeParse(TableViewEditFormSchema, {
      distro,
      id: "mine",
      name: "Mine",
    });

    expect(result.issues?.map((issue) => v.getDotPath(issue))).toEqual([
      "distro",
    ]);
  });
});
