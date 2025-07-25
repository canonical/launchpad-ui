import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./MulticolorIcon.svelte";

describe("MulticolorIcon component", () => {
  it("renders", async () => {
    const { container } = render(Component, { name: "error" });
    const icon = container.querySelector(".ds.multicolor-icon");
    expect(icon).toBeDefined();
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { container } = render(Component, {
        id: "test-id",
        name: "error",
      });
      const icon = container.querySelector(".ds.multicolor-icon");
      expect(icon?.id).toBe("test-id");
    });

    it("applies style", () => {
      const { container } = render(Component, {
        style: "color: red;",
        name: "error",
      });
      const icon = container.querySelector(".ds.multicolor-icon");
      expect(icon?.getAttribute("style")).toContain("color: red;");
    });

    it("applies class", () => {
      const { container } = render(Component, {
        class: "test-class",
        name: "error",
      });
      const icon = container.querySelector(".ds.multicolor-icon");
      expect(icon?.classList.contains("test-class")).toBe(true);
    });
  });

  it("renders icons with background image", () => {
    const { container } = render(Component, { name: "error" });
    const icon = container.querySelector(".ds.multicolor-icon");

    assert(icon !== null);
    expect(icon.computedStyleMap().get("background-image")).not.toBe("none");
  });
});
