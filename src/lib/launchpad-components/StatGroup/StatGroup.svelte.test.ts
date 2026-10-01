import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import Component from "./StatGroup.svelte";
import SubgridFixture from "./SubgridFixture.svelte";
import { sixStats, threeStats } from "./test.fixtures.svelte";

describe("StatGroup component", () => {
  const baseProps = {
    children: threeStats,
    class: "test-class",
    "data-testid": "stat-group",
    "aria-label": "Build status",
  } satisfies ComponentProps<typeof Component>;

  it("renders a semantic description list and forwards attributes", async () => {
    const page = await render(Component, { ...baseProps });
    const root = page.getByTestId("stat-group");
    const element = root.element();

    expect(element.tagName).toBe("DIV");
    expect(element.classList).toContain("test-class");
    await expect.element(root).toHaveAttribute("aria-label", "Build status");

    const groups = element.querySelectorAll(":scope > dl");
    expect(groups).toHaveLength(3);
    for (const group of groups) {
      expect(group.children[0]?.tagName).toBe("DT");
      expect(group.children[1]?.tagName).toBe("DD");
    }

    expect(page.getByText("35", { exact: true }).element().tagName).toBe(
      "STRONG",
    );
  });

  it("uses a larger description style for featured stats", async () => {
    const page = await render(Component, { ...baseProps });
    const featured = page.getByTestId("stat-1").element().querySelector("dd");
    const regular = page.getByTestId("stat-2").element().querySelector("dd");

    if (!featured || !regular) throw new Error("Expected descriptions");
    expect(
      Number.parseFloat(getComputedStyle(featured).fontSize),
    ).toBeGreaterThan(Number.parseFloat(getComputedStyle(regular).fontSize));
  });

  it("places stats in configured columns and flows each stat vertically", async () => {
    const page = await render(Component, {
      columns: 3,
      children: sixStats,
      "data-testid": "stat-group",
    });

    const boxes = Array.from({ length: 6 }, (_, index) =>
      page
        .getByTestId(`stat-${index + 1}`)
        .element()
        .getBoundingClientRect(),
    );

    expect(boxes[0].y).toBeCloseTo(boxes[1].y, 1);
    expect(boxes[0].y).toBeCloseTo(boxes[2].y, 1);
    expect(boxes[0].x).toBeLessThan(boxes[1].x);
    expect(boxes[1].x).toBeLessThan(boxes[2].x);
    expect(boxes[3].x).toBeCloseTo(boxes[0].x, 1);
    expect(boxes[3].y).toBeGreaterThan(boxes[0].y);

    const firstStat = page.getByTestId("stat-1").element();
    const term = firstStat.querySelector("dt")?.getBoundingClientRect();
    const description = firstStat.querySelector("dd")?.getBoundingClientRect();
    expect(term).toBeDefined();
    expect(description).toBeDefined();
    expect(description!.y).toBeGreaterThan(term!.y);
  });

  it("inherits exactly three tracks from a six-track parent grid", async () => {
    const page = await render(SubgridFixture);
    const parent = page
      .getByTestId("parent-grid")
      .element()
      .getBoundingClientRect();
    const external = page
      .getByTestId("external")
      .element()
      .getBoundingClientRect();
    const root = page
      .getByTestId("stat-group")
      .element()
      .getBoundingClientRect();
    const stats = ["stat-1", "stat-2", "stat-3"].map((testId) =>
      page.getByTestId(testId).element().getBoundingClientRect(),
    );

    expect(external.width).toBeCloseTo(300, 1);
    expect(root.x).toBeCloseTo(parent.x + 300, 1);
    expect(root.width).toBeCloseTo(300, 1);
    expect(stats.map(({ width }) => width)).toEqual([100, 100, 100]);
    expect(stats.map(({ x }) => Math.round(x - parent.x))).toEqual([
      300, 400, 500,
    ]);
  });
});
