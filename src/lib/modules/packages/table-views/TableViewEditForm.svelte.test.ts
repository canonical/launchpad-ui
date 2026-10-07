import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
import TableViewEditForm from "./TableViewEditForm.svelte";
import type { TableViewSettings } from "./schema.js";

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: {
      url: new SvelteURL(
        "https://launchpad.test/ubuntu/+source?panel=manage-views&manage-views.edit=mine",
      ),
    },
  };
});

vi.mock("$lib/modules/packages/people.remote.js", () => ({
  findPeople: vi.fn(() => Promise.resolve([])),
  getPersonByName: vi.fn(() => Promise.resolve(null)),
}));

const settings: TableViewSettings = {
  name: "Mine",
  filters: { ...DEFAULT_PACKAGES_FILTERS, series: "noble", ubuntuChange: true },
};

// Kit shares a `.for(slug)` form instance while it's in use, so each test gets its own view
let viewCount = 0;

async function renderForm() {
  const onstage = vi.fn();
  const screen = await render(TableViewEditForm, {
    view: { name: "Mine", slug: `mine-${viewCount++}`, editable: true },
    settings,
    cancelHref: "?panel=manage-views",
    onstage,
  });
  return { screen, onstage };
}

describe("TableViewEditForm", () => {
  it("starts from the given settings", async () => {
    const { screen } = await renderForm();

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue("Mine");
    await expect
      .element(screen.getByRole("button", { name: /^Series/ }))
      .toHaveTextContent("24.04 LTS (Noble Numbat)");
    await expect
      .element(screen.getByRole("checkbox", { name: /changed by Ubuntu/ }))
      .toBeChecked();
    await expect
      .element(screen.getByRole("checkbox", { name: /Superseded/ }))
      .not.toBeChecked();
  });

  it("only allows confirming a change", async () => {
    const { screen } = await renderForm();
    const confirm = screen.getByRole("button", { name: "Confirm" });

    await expect.element(confirm).toBeDisabled();
    await screen.getByRole("textbox", { name: "Keyword" }).fill("linux");
    await expect.element(confirm).toBeEnabled();
  });

  it("does not submit unchanged settings on Enter", async () => {
    const { screen, onstage } = await renderForm();
    const name = screen.getByRole("textbox", { name: "* View name" });

    await name.click();
    await userEvent.keyboard("{Enter}");

    expect(onstage).not.toHaveBeenCalled();
  });

  it("stages the edited settings instead of submitting them", async () => {
    const { screen, onstage } = await renderForm();

    const pocket = screen.getByRole("button", { name: /^Pocket/ });
    await pocket.click();
    await screen.getByRole("radio", { name: "Updates" }).click();
    await pocket.click();
    await screen.getByRole("checkbox", { name: /Superseded/ }).click();
    await screen.getByRole("textbox", { name: "* View name" }).fill(" Mine 2 ");
    await screen.getByRole("button", { name: "Confirm" }).click();

    await expect
      .poll(() => onstage.mock.calls)
      .toEqual([
        [
          {
            name: "Mine 2",
            filters: {
              ...settings.filters,
              pocket: "Updates",
              allStatuses: true,
            },
          },
        ],
      ]);
  });

  it("doesn't stage a blank name", async () => {
    const { screen, onstage } = await renderForm();
    const name = screen.getByRole("textbox", { name: "* View name" });

    await name.fill("");
    await screen.getByRole("button", { name: "Confirm" }).click();

    await expect.element(name).toBeInvalid();
    expect(onstage).not.toHaveBeenCalled();
  });

  it("links Cancel to the given href", async () => {
    const { screen } = await renderForm();

    await expect
      .element(screen.getByRole("link", { name: "Cancel" }))
      .toHaveAttribute("href", "?panel=manage-views");
  });
});
