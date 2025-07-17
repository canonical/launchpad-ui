/* @canonical/generator-ds 0.9.0-experimental.22 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Tabs.svelte";

describe("Tabs component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<span>Tabs</span>`,
    }));

    const page = render(Component, { children });
    const element = page.getByText("Tabs");
    await expect.element(element).toBeInTheDocument();
  });
});
