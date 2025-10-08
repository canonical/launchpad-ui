/* @canonical/generator-ds 0.10.0-experimental.3 */

import { createRawSnippet } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./LinkItem.svelte";

describe("LinkItem component", () => {
  const baseProps = {
    href: "#",
    children: createRawSnippet(() => ({
      render: () => `<span>LinkItem</span>`,
    })),
  };

  it("renders", async () => {
    const page = render(Component, baseProps);
    await expect.element(page.getByRole("link")).toBeInTheDocument();
  });

  describe("Basic attributes", () => {
    it("applies id", async () => {
      const page = render(Component, {
        id: "test-id",
        ...baseProps,
      });
      await expect
        .element(page.getByRole("link"))
        .toHaveAttribute("id", "test-id");
    });

    it("applies style", async () => {
      const page = render(Component, {
        style: "color: red;",
        ...baseProps,
      });
      await expect.element(page.getByRole("link")).toHaveStyle("color: red;");
    });

    it("applies class", async () => {
      const page = render(Component, {
        class: "test-class",
        ...baseProps,
      });
      await expect.element(page.getByRole("link")).toHaveClass("test-class");
    });
  });
});
