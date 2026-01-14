/* @canonical/generator-ds 0.10.0-experimental.5 */

import { createRawSnippet, mount, unmount } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Combobox.svelte";
import { Loading } from "./common/index.js";

describe("Combobox component", () => {
  const baseProps = {
    search: createRawSnippet(() => ({
      render: () =>
        `<input type="search" data-testid="search-input" aria-label="Search" />`,
    })),
    inputsName: "options",
  } satisfies ComponentProps<typeof Component>;

  it("renders", async () => {
    const page = render(Component, { ...baseProps });
    await expect.element(componentLocator(page)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([
      ["id", "test-id"],
      ["aria-label", "test-aria-label"],
    ])("applies %s", async (attribute, expected) => {
      const page = render(Component, { ...baseProps, [attribute]: expected });
      await expect
        .element(componentLocator(page))
        .toHaveAttribute(attribute, expected);
    });

    it("applies classes", async () => {
      const page = render(Component, { ...baseProps, class: "test-class" });
      await expect.element(componentLocator(page)).toHaveClass("test-class");
    });

    it("applies style", async () => {
      const page = render(Component, {
        ...baseProps,
        style: "color: orange;",
      });
      await expect
        .element(componentLocator(page))
        .toHaveStyle({ color: "orange" });
    });
  });

  describe("Renders", () => {
    it("search", async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(page.getByTestId("search-input"))
        .toBeInTheDocument();
    });

    it("listbox", async () => {
      const page = render(Component, { ...baseProps });
      await expect.element(page.getByRole("listbox")).toBeInTheDocument();
    });

    it("children", async () => {
      const children = createRawSnippet(() => ({
        render: () => '<div data-testid="option-1">Option 1</div>',
      }));
      const page = render(Component, {
        ...baseProps,
        children: children,
      });
      await expect.element(page.getByTestId("option-1")).toBeInTheDocument();
    });
  });

  describe("listbox attributes", () => {
    it('applies aria-multiselectable="true" by default', async () => {
      const page = render(Component, { ...baseProps });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "true");
    });

    it("applies aria-multiselectable when type prop provided", async () => {
      let page = render(Component, {
        ...baseProps,
        type: "single-select",
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "false");

      page.unmount();

      page = render(Component, {
        ...baseProps,
        type: "multi-select",
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-multiselectable", "true");
    });

    it("applies aria-busy when passed as a prop", async () => {
      let page = render(Component, {
        ...baseProps,
        "aria-busy": true,
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "true");

      page.unmount();

      page = render(Component, {
        ...baseProps,
        "aria-busy": false,
      });
      await expect
        .element(page.getByRole("listbox"))
        .toHaveAttribute("aria-busy", "false");
    });

    it("applies aria-busy when <Loading> is present", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let loadingComponent: any = null;

      const children = createRawSnippet(() => ({
        render: () => "<div></div>",
        setup: (target) => {
          loadingComponent = mount(Loading, { target });
          return () => loadingComponent && unmount(loadingComponent);
        },
      }));
      const page = render(Component, {
        ...baseProps,
        children: children,
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

function componentLocator(page: RenderResult<typeof Component>): Locator {
  return page.getByTestId("combobox");
}
