import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Layout from "./+layout.svelte";

const page = vi.hoisted(() => ({
  route: { id: "/[pillar]/[series]" as string | null },
}));

vi.mock("$app/state", () => ({ page }));

const children = createRawSnippet(() => ({
  render: () => `<h1 style="margin: 0">26.04 LTS (Resolute Raccoon)</h1>`,
}));

const baseProps = {
  params: { pillar: "ubuntu", series: "resolute" },
  data: {},
  children,
} satisfies ComponentProps<typeof Layout>;

beforeEach(() => {
  page.route.id = "/[pillar]/[series]";
});

describe("pillar layout", () => {
  it("renders the route's breadcrumbs above the page", async () => {
    const screen = await render(Layout, baseProps);
    const breadcrumbs = screen.getByRole("navigation", {
      name: "Breadcrumbs",
    });

    await expect
      .element(breadcrumbs.getByRole("link", { name: "Ubuntu" }))
      .toBeVisible();
    await expect
      .element(breadcrumbs.getByText("Series", { exact: true }))
      .toBeVisible();
    expect(
      breadcrumbs
        .element()
        .compareDocumentPosition(
          screen.getByRole("heading", { level: 1 }).element(),
        ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("renders no breadcrumbs outside a pillar page", async () => {
    page.route.id = null;
    const screen = await render(Layout, {
      ...baseProps,
      params: { pillar: "ubuntu" },
    });

    await expect
      .element(screen.getByRole("heading", { level: 1 }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("navigation", { name: "Breadcrumbs" }))
      .not.toBeInTheDocument();
  });
});
