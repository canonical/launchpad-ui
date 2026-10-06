import { createRawSnippet } from "svelte";
import type { ComponentProps } from "svelte";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import PageLayout from "./PageLayout.svelte";

const children = createRawSnippet(() => ({
  render: () => `<h1>26.04 LTS (Resolute Raccoon)</h1>`,
}));

const baseProps = {
  breadcrumbsSegments: [
    { label: "Ubuntu", href: "/ubuntu" },
    { label: "Series" },
  ],
  children,
} satisfies ComponentProps<typeof PageLayout>;

describe("page layout", () => {
  it("renders the page inside the main landmark", async () => {
    const screen = await render(PageLayout, baseProps);

    await expect
      .element(screen.getByRole("main").getByRole("heading", { level: 1 }))
      .toBeVisible();
  });

  it("renders the breadcrumbs above the page", async () => {
    const screen = await render(PageLayout, baseProps);
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

  it.each([
    { case: "omitted", breadcrumbsSegments: undefined },
    { case: "empty", breadcrumbsSegments: [] },
  ])(
    "renders no breadcrumbs when segments are $case",
    async ({ breadcrumbsSegments }) => {
      const screen = await render(PageLayout, {
        breadcrumbsSegments,
        children,
      });

      await expect
        .element(screen.getByRole("heading", { level: 1 }))
        .toBeVisible();
      await expect
        .element(screen.getByRole("navigation", { name: "Breadcrumbs" }))
        .not.toBeInTheDocument();
    },
  );
});
