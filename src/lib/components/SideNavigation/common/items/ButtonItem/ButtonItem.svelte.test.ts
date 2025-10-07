/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./ButtonItem.svelte";

describe("ButtonItem component", () => {
  const children = createRawSnippet(() => ({
    render: () => `<span>ButtonItem</span>`,
  }));

  it("renders", async () => {
    const page = render(Component, { children });
    await expect.element(page.getByRole("button")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        id: "test-id",
        children,
      });
      await expect
        .element(page.getByRole("button"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
        children,
      });
      await expect.element(page.getByRole("button")).toHaveStyle("color: red;");
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
        children,
      });
      await expect.element(page.getByRole("button")).toHaveClass("test-class");
    });
  });
});
