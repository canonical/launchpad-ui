/* @canonical/generator-ds 0.10.0-experimental.5 */

import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import type { Locator } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./JobStatusIcon.svelte";

describe("JobStatusIcon component", () => {
  const baseProps = {
    status: null,
  } satisfies ComponentProps<typeof Component>;

  it.each([
    "PENDING",
    "EXECUTING",
    "IDLE",
    "FINISHED",
    "FAILED",
    "CANCELLED",
    null,
  ] as const)("renders %s", async (status) => {
    const page = render(Component, { ...baseProps, status });
    await expect.element(componentLocator(page, status)).toBeInTheDocument();
  });

  describe("attributes", () => {
    it.each([["id", "test-id"]])("applies %s", async (attribute, expected) => {
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
});

function componentLocator(
  page: RenderResult<typeof Component>,
  status: string | null = null,
): Locator {
  return page.getByRole("img", { name: status || "Unknown" });
}
