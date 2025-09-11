/* @canonical/generator-ds 0.10.0-experimental.2 */

import { createRawSnippet, mount, unmount } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Combobox.svelte";
import { Loading } from "./common/index.js";

const search = createRawSnippet(() => ({
  render: () =>
    `<input type="search" data-testid="search-input" aria-label="Search" />`,
}));

const requiredProps = { search, inputsName: "options" };

describe("Combobox component", () => {
  describe("Renders", () => {
    it("with required props", async () => {
      const page = render(Component, requiredProps);
      await expect.element(testIdLocator(page)).toBeInTheDocument();
    });

    it("search", async () => {
      const page = render(Component, requiredProps);
      await expect
        .element(page.getByTestId("search-input"))
        .toBeInTheDocument();
    });

    it("listbox", async () => {
      const page = render(Component, requiredProps);
      await expect.element(page.getByRole("listbox")).toBeInTheDocument();
    });

    it("children", async () => {
      const page = render(Component, {
        ...requiredProps,
        children: createRawSnippet(() => ({
          render: () => '<div data-testid="option-1">Option 1</div>',
        })),
      });
      await expect.element(page.getByTestId("option-1")).toBeInTheDocument();
    });
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, { id: "test-id", ...requiredProps });
      await expect
        .element(testIdLocator(page))
        .toHaveAttribute("id", "test-id");
    });

    it("applies class", async () => {
      const page = render(Component, { class: "test-class", ...requiredProps });
      await expect.element(testIdLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: blue;",
        ...requiredProps,
      });
      await expect.element(testIdLocator(page)).toHaveStyle("color: blue;");
    });
  });

  describe("listbox attributes", () => {
    it('applies aria-multiselectable="true" by default', async () => {
      const page = render(Component, requiredProps);
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "true");
    });

    it("applies aria-multiselectable when type prop provided", async () => {
      let page = render(Component, {
        ...requiredProps,
        type: "single-select",
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "false");

      page.unmount();

      page = render(Component, {
        ...requiredProps,
        type: "multi-select",
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "true");
    });

    it("applies aria-busy when passed as a prop", async () => {
      let page = render(Component, {
        ...requiredProps,
        "aria-busy": true,
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "true");

      page.unmount();

      page = render(Component, {
        ...requiredProps,
        "aria-busy": false,
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "false");
    });

    it("applies aria-busy when <Loading> is present", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let loadingComponent: any = null;

      const page = render(Component, {
        ...requiredProps,
        children: createRawSnippet(() => ({
          render: () => "<div></div>",
          setup: (target) => {
            loadingComponent = mount(Loading, { target });
            return () => loadingComponent && unmount(loadingComponent);
          },
        })),
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "true");

      unmount(loadingComponent);
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "false");
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function testIdLocator(page: RenderResult<any>) {
  return page.getByTestId("combobox");
}
