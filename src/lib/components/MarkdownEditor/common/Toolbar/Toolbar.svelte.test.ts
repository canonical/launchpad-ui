/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";

describe("Markdown Editor > Toolbar component", () => {
  it("renders", async () => {
    const page = render(Component, { noDefaultActions: true });
    const element = page.getByRole("toolbar");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, {
      class: "test-class",
      noDefaultActions: true,
    });
    const element = page.getByRole("toolbar");
    await expect.element(element).toHaveClass("test-class");
  });
});
