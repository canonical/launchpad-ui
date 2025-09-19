/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Textarea.svelte";

describe("Textarea component", () => {
  it("renders", async () => {
    const page = render(Component);
    const element = page.getByRole("textbox");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const page = render(Component, { class: "test-class" });
    const element = page.getByRole("textbox");
    await expect.element(element).toHaveClass("test-class");
  });
});
