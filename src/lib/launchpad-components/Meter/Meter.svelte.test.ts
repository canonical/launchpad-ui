import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { RenderResult } from "vitest-browser-svelte";
import Component from "./Meter.svelte";

describe("Meter component", () => {
  const baseProps = {
    "data-testid": "meter",
    min: 0,
    max: 100,
    value: 50,
  } satisfies ComponentProps<typeof Component>;

  it("renders a native meter with its range and value", async () => {
    const page = await render(Component, { ...baseProps });
    const meter = meterLocator(page);

    await expect.element(meter).toBeVisible();
    expect(meter.element().tagName).toBe("METER");
    await expect.element(meter).toHaveAttribute("min", "0");
    await expect.element(meter).toHaveAttribute("max", "100");
    await expect.element(meter).toHaveAttribute("value", "50");
  });

  it("preserves the base class and applies custom and criticality classes", async () => {
    const page = await render(Component, {
      ...baseProps,
      class: "custom-meter",
      criticality: "warning",
    });

    await expect
      .element(meterLocator(page))
      .toHaveClass("meter", "custom-meter", "warning");
  });

  it("forwards HTML attributes to the meter", async () => {
    const page = await render(Component, {
      ...baseProps,
      id: "build-progress",
      "aria-label": "Build progress",
    });
    const meter = meterLocator(page);

    await expect.element(meter).toHaveAttribute("id", "build-progress");
    await expect.element(meter).toHaveAttribute("aria-label", "Build progress");
  });
});

function meterLocator(page: RenderResult<typeof Component>) {
  return page.getByTestId("meter");
}
