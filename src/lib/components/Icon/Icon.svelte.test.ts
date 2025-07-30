/* @canonical/generator-ds 0.9.0-experimental.22 */

import { assert, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Icon.svelte";

describe("Icon component", () => {
  it("renders", async () => {
    const { container } = render(Component, { name: "edit" });
    const icon = container.querySelector(".ds.icon");
    expect(icon).toBeDefined();
  });

  describe("basic attributes", () => {
    it("applies id", () => {
      const { container } = render(Component, {
        id: "test-id",
        name: "edit",
      });
      const icon = container.querySelector(".ds.icon");
      expect(icon?.id).toBe("test-id");
    });

    it("applies style", () => {
      const { container } = render(Component, {
        style: "color: red;",
        name: "edit",
      });
      const icon = container.querySelector(".ds.icon");
      expect(icon?.getAttribute("style")).toContain("color: red;");
    });

    it("applies class", () => {
      const { container } = render(Component, {
        class: "test-class",
        name: "edit",
      });
      const icon = container.querySelector(".ds.icon");
      expect(icon?.classList.contains("test-class")).toBe(true);
    });
  });

  it("renders icons with mask image", () => {
    const { container } = render(Component, { name: "edit" });
    const icon = container.querySelector(".ds.icon");

    assert(icon !== null);
    expect(icon.computedStyleMap().get("mask-image")?.toString()).not.toBe(
      "none",
    );
  });

  it("renders icons with currentColor", () => {
    const { container } = render(Component, {
      name: "edit",
      style: "color: blue;",
    });
    const icon = container.querySelector(".ds.icon");

    assert(icon !== null);
    expect(icon.computedStyleMap().get("color")?.toString()).toBe(
      "rgb(0, 0, 255)",
    );
  });
});
