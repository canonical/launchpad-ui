/* @canonical/generator-ds 0.10.0-experimental.2 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Spinner.svelte";

describe("Spinner component", () => {
  it("renders", async () => {
    const page = render(Component);
    const element = page.getByLabelText("Loading");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, { class: "test-class" });
    const element = page.getByLabelText("Loading");
    await expect.element(element).toHaveClass("test-class");
  });
});
