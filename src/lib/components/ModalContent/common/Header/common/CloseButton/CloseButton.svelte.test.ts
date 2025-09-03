/* @canonical/generator-ds 0.10.0-experimental.2 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./CloseButton.svelte";

describe("CloseButton component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect
      .element(page.getByRole("button", { name: "Close" }))
      .toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id" });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class" });
      await expect.element(page.getByRole("button")).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;" });
      await expect.element(page.getByRole("button")).toHaveStyle("color: red;");
    });
  });
});
