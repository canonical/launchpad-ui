/* @canonical/generator-ds 0.10.0-experimental.0 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Badge.svelte";

describe("Badge component", () => {
  it("renders", async () => {
    const page = render(Component, { value: 42 });
    await expect.element(testIdLocator(page)).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", value: 42 });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", value: 42 });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;", value: 42 });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });

  describe("Display value", () => {
    it("displays the capped variant by default", async () => {
      const page = render(Component, { value: 10000 });
      await expect.element(testIdLocator(page)).toHaveTextContent("999+");
    });

    describe("capped", () => {
      it("displays 0 for negative values", async () => {
        const page = render(Component, { value: -1, variant: "capped" });
        await expect.element(testIdLocator(page)).toHaveTextContent("0");
      });

      it("rounds to the nearest integer", async () => {
        const page = render(Component, { value: 42.6, variant: "capped" });
        await expect.element(testIdLocator(page)).toHaveTextContent("43");
      });

      it("displays the values up to 999", async () => {
        const page = render(Component, { value: 999, variant: "capped" });
        await expect.element(testIdLocator(page)).toHaveTextContent("999");
      });

      it("caps the value at 999", async () => {
        const page = render(Component, { value: 10000, variant: "capped" });
        await expect.element(testIdLocator(page)).toHaveTextContent("999+");
      });
    });

    describe("rounded", () => {
      it("displays 0 for negative values", async () => {
        const page = render(Component, { value: -1, variant: "rounded" });
        await expect.element(testIdLocator(page)).toHaveTextContent("0");
      });

      it("rounds to the nearest integer", async () => {
        const page = render(Component, { value: 42.6, variant: "rounded" });
        await expect.element(testIdLocator(page)).toHaveTextContent("43");
      });

      it.each([
        [0, "0"],
        [42.6, "43"],
        [999, "999"],
        [1_000, "1K"],
        [1_500, "1.5K"],
        [2_500_000, "2.5M"],
        [1_000_000_000, "1B"],
        [1_234_567_890_123, "1.2T"],
      ])("displays %d as %s", async (input, expected) => {
        const page = render(Component, { value: input, variant: "rounded" });
        await expect.element(testIdLocator(page)).toHaveTextContent(expected);
      });
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("badge");
}
