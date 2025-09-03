/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Body.svelte";

describe("Body component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => "<span>Body</span>",
    }));
    const page = render(Component, { children });
    await expect.element(page.getByText("Body")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id" });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class" });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;" });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("modal-content-body");
}
