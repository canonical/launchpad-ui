/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Select.svelte";

describe("Select component", () => {
  it("renders", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<option value="1">Option 1</option>`,
    }));

    const page = render(Component, { children });
    const element = page.getByRole("combobox");
    await expect.element(element).toBeInTheDocument();
  });

  it("applies class", async () => {
    const children = createRawSnippet(() => ({
      render: () => `<option value="1">Option 1</option>`,
    }));

    const page = render(Component, { children, class: "test-class" });
    const element = page.getByRole("combobox");
    await expect.element(element.element()).toHaveClass("test-class");
  });
});
