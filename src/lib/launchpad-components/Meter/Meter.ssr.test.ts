import { render } from "@canonical/svelte-ssr-test";
import type { RenderResult } from "@canonical/svelte-ssr-test";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import Component from "./Meter.svelte";

describe("Meter SSR", () => {
  const baseProps = {
    min: 0,
    max: 100,
    value: 50,
  } satisfies ComponentProps<typeof Component>;

  it("renders a native meter with its range and value", () => {
    const page = render(Component, { props: { ...baseProps } });
    const meter = meterLocator(page);

    expect(meter.tagName).toBe("METER");
    expect(meter.getAttribute("min")).toBe("0");
    expect(meter.getAttribute("max")).toBe("100");
    expect(meter.getAttribute("value")).toBe("50");
  });

  it("preserves the base class and applies custom and criticality classes", () => {
    const page = render(Component, {
      props: { ...baseProps, class: "custom-meter", criticality: "warning" },
    });
    const meter = meterLocator(page);

    expect(meter.classList.contains("meter")).toBe(true);
    expect(meter.classList.contains("custom-meter")).toBe(true);
    expect(meter.classList.contains("warning")).toBe(true);
  });

  it("forwards HTML attributes to the meter", () => {
    const page = render(Component, {
      props: {
        ...baseProps,
        id: "build-progress",
        "aria-label": "Build progress",
      },
    });
    const meter = meterLocator(page);

    expect(meter.getAttribute("id")).toBe("build-progress");
    expect(meter.getAttribute("aria-label")).toBe("Build progress");
  });
});

function meterLocator(page: RenderResult): HTMLElement {
  return page.document.querySelector("meter")!;
}
