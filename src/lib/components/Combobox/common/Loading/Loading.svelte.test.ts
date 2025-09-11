/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import type { ComboboxContext } from "../../types.js";
import Component from "./Loading.svelte";

const { loadingHidden, loadingShown } = vi.hoisted(() => {
  const loadingHidden = vi.fn();
  const loadingShown = vi.fn(() => loadingHidden);
  return { loadingHidden, loadingShown };
});

vi.mock("../../context.js", () => {
  return {
    getComboboxContext: (): Partial<ComboboxContext> => ({
      loadingShown,
    }),
  };
});

describe("Loading component", () => {
  it("renders", async () => {
    const page = render(Component);
    await expect.element(testIdLocator(page)).toHaveTextContent("Loading…");
  });

  it("renders children", async () => {
    const page = render(Component, {
      children: createRawSnippet(() => ({
        render: () => "<span>Fetching data</span>",
      })),
    });
    await expect
      .element(testIdLocator(page))
      .toHaveTextContent("Fetching data");
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

  describe("Registers its presence in Combobox context", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("calls loadingShown when mounted", async () => {
      const page = render(Component);
      await expect.element(testIdLocator(page)).toBeInTheDocument();
      expect(loadingShown).toHaveBeenCalledOnce();
    });

    it("calls loadingHidden when unmounted", async () => {
      const page = render(Component);
      await expect.element(testIdLocator(page)).toBeInTheDocument();
      page.unmount();
      await expect.element(testIdLocator(page)).not.toBeInTheDocument();
      expect(loadingHidden).toHaveBeenCalledOnce();
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("combobox-loading");
}
