/* @canonical/generator-ds 0.10.0-experimental.3 */

import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./Toolbar.svelte";

vi.mock("$lib/shortcuts/index.js", async (importActual) => {
  const actual = await importActual<typeof import("$lib/shortcuts/index.js")>();
  return {
    ...actual,
    // Mock so we don't get errors about `useShortcuts` being called outside of a provider
    useShortcuts: vi.fn(),
  };
});

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
