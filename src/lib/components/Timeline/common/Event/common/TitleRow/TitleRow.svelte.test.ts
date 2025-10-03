/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./TitleRow.svelte";

const children = createRawSnippet(() => ({
  render: () => "<span>Title Row Content</span>",
}));

const date = createRawSnippet(() => ({
  render: () => "<span>2023-03-15</span>",
}));

describe("TitleRow component", () => {
  it("renders", async () => {
    const page = render(Component, { children, date });
    await expect.element(testIdLocator(page)).toBeInTheDocument();
    await expect
      .element(page.getByText("Title Row Content"))
      .toBeInTheDocument();
  });

  it("renders leadingText", async () => {
    const page = render(Component, {
      children,
      date,
      leadingText: "Leading Text",
    });
    await expect.element(page.getByText("Leading Text")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", children, date });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", children, date });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, { style: "color: red;", children, date });
      await expect.element(testIdLocator(page)).toHaveStyle("color: red;");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("title-row");
}
