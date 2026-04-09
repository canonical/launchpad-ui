/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./UserChip.svelte";

describe("UserChip component", () => {
  const baseProps = {
    userName: "John Doe",
    userAvatarUrl: "https://assets.ubuntu.com/v1/fca94c45-snap+icon.png",
    "data-testid": "user-chip",
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
      await expect.element(componentLocator(page)).toHaveClass("ds");
      await expect.element(componentLocator(page)).toHaveClass("user-chip");
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

  describe("avatar", () => {
    it("renders by default", async () => {
      const page = render(Component, {
        ...baseProps,
      });

      await expect.element(avatarLocator(page)).toBeInTheDocument();
    });

    it("renders when showAvatar is true", async () => {
      const page = render(Component, {
        ...baseProps,
        showAvatar: true,
      });

      await expect.element(avatarLocator(page)).toBeInTheDocument();
    });

    it("doesn't render when showAvatar is false", async () => {
      const page = render(Component, {
        ...baseProps,
        showAvatar: false,
      });

      await expect.element(avatarLocator(page)).not.toBeInTheDocument();
    });
  });
});

function componentLocator(page: RenderResult<typeof Component>) {
  return page.getByTestId("user-chip");
}

function avatarLocator(page: RenderResult<typeof Component>) {
  return page.getByRole("img");
}
