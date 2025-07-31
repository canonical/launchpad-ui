/* @canonical/generator-ds 0.9.0-experimental.22 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./TabList.svelte";

describe("TabList component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>TabList</span>`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("TabList");
    await expect.element(element).toBeInTheDocument();
  });
});
