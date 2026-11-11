import { SvelteURL } from "svelte/reactivity";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Filters from "./Filters.svelte";

const url = new SvelteURL("https://launchpad.test/ubuntu/resolute");

vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

vi.mock("$app/state", () => ({
  page: {
    get url() {
      return url;
    },
  },
}));

vi.mock("../context.js", async () => {
  const { QueryParams } = await import("../superhref.js");
  return {
    getImagesContext: () => ({
      get queryParams() {
        return QueryParams.bind(new URL(url.href));
      },
    }),
  };
});

function submittedParams(container: Element): Promise<Record<string, string>> {
  const submitted = Promise.withResolvers<Record<string, string>>();
  container.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted.resolve(
      Object.fromEntries(
        new FormData(event.target as HTMLFormElement),
      ) as Record<string, string>,
    );
  });
  return submitted.promise;
}

describe("Filters", () => {
  it("reflects the URL filters in the controls", async () => {
    url.search =
      "?images.product=kubuntu&images.build-status=successful" +
      "&images.test-status=passed";
    const screen = await render(Filters);

    for (const name of [
      "Product: Kubuntu",
      "Build status: Successful",
      "Test status: Passed",
    ]) {
      await expect.element(screen.getByRole("button", { name })).toBeVisible();
    }
  });

  it.each([
    ["Product", "radio", "Kubuntu", { "images.product": "kubuntu" }],
    [
      "Build status",
      "radio",
      "Successful",
      { "images.build-status": "successful" },
    ],
    ["Test status", "radio", "Failed", { "images.test-status": "failed" }],
  ] as const)(
    "applies the %s filter on the first page, keeping other params",
    async (trigger, role, name, applied) => {
      url.search = "?images.sort=version&images.page=3";
      const screen = await render(Filters);
      const submitted = submittedParams(screen.container);

      await screen
        .getByRole("button", { name: new RegExp(`^${trigger}:`) })
        .click();
      await screen.getByRole(role, { name }).click();

      expect(await submitted).toEqual({
        "images.sort": "version",
        ...applied,
      });
    },
  );

  it("clears every filter and returns to the first page, keeping the sort", async () => {
    url.search =
      "?images.sort=version&images.product=kubuntu" +
      "&images.build-status=successful&images.test-status=passed&images.page=3";
    const screen = await render(Filters);

    await expect
      .element(screen.getByRole("link", { name: "Clear all filters" }))
      .toHaveAttribute("href", "?images.sort=version");
  });

  it("offers to bookmark the active filters as a new view", async () => {
    url.search =
      "?images.product=kubuntu&images.build-status=successful&page=3";
    const screen = await render(Filters);

    const link = screen.getByRole("link", { name: "Save current filters" });
    await expect.element(link).toBeVisible();

    const href = link.element().getAttribute("href")!;
    const params = new URL(href, url).searchParams;
    expect(params.get("images.product")).toBe("kubuntu");
    expect(params.get("images.build-status")).toBe("successful");
    expect(params.get("panel")).toBe("manage-views");
    expect(params.get("manage-views.add")).toBe("bookmark");
  });

  it("does not offer to clear or bookmark no filters", async () => {
    url.search = "";
    const screen = await render(Filters);

    await expect
      .element(screen.getByRole("button", { name: /^Product:/ }))
      .toBeVisible();
    await expect
      .element(screen.getByRole("link", { name: "Clear all filters" }))
      .not.toBeInTheDocument();
    await expect
      .element(screen.getByRole("link", { name: "Save current filters" }))
      .not.toBeInTheDocument();
  });
});
