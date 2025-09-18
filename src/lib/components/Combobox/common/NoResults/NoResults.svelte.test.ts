/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./NoResults.svelte";

describe("NoResults component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(testIdLocator(page)).toHaveTextContent("No results.");
  });

  it("renders children", async () => {
    const page = render(Component, {
      children: createRawSnippet(() => ({
        render: () => "<span>Nothing found</span>",
      })),
    });
    await expect
      .element(testIdLocator(page))
      .toHaveTextContent("Nothing found");
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
  return page.getByTestId("combobox-no-results");
}
