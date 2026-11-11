import type { ComponentProps } from "svelte";
import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import { DEFAULT_IMAGES_FILTERS } from "../filters/constants.js";
import TableViewEditForm from "./TableViewEditForm.svelte";
import type { TableViewSettings } from "./schema.js";
import { createTableView, editTableView } from "./table-views.remote.js";

vi.mock("$app/state", async () => {
  const { SvelteURL } = await import("svelte/reactivity");
  return {
    page: {
      url: new SvelteURL(
        "https://launchpad.test/ubuntu/resolute?panel=manage-views&manage-views.edit=mine",
      ),
    },
  };
});

const settings: TableViewSettings = {
  name: "Mine",
  filters: { ...DEFAULT_IMAGES_FILTERS },
};

describe("TableViewEditForm", () => {
  it("starts from the given settings", async () => {
    const { screen } = await renderForm();

    await expect
      .element(screen.getByRole("textbox", { name: "* View name" }))
      .toHaveValue("Mine");
    await expect
      .element(screen.getByRole("button", { name: /^Product/ }))
      .toHaveTextContent("All");
    await expect
      .element(screen.getByRole("button", { name: /^Build status/ }))
      .toHaveTextContent("All");
    await expect
      .element(screen.getByRole("button", { name: /^Test status/ }))
      .toHaveTextContent("All");
  });

  it("only allows confirming a change", async () => {
    const { screen } = await renderForm();
    const confirm = screen.getByRole("button", { name: "Confirm" });

    await expect.element(confirm).toBeDisabled();
    await screen.getByRole("button", { name: /^Build status/ }).click();
    await screen.getByRole("radio", { name: "Failed" }).click();
    await expect.element(confirm).toBeEnabled();
  });

  it("allows confirming unchanged settings when no change is required", async () => {
    const { screen, onstage } = await renderForm({ requireChange: false });

    await screen.getByRole("button", { name: "Confirm" }).click();

    await expect.poll(() => onstage.mock.calls).toEqual([[settings]]);
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

    const product = screen.getByRole("button", { name: /^Product/ });
    await product.click();
    await screen.getByRole("radio", { name: "Kubuntu" }).click();
    await product.click();
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
              product: "kubuntu",
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

  it("starts the create form blank after it was closed", async () => {
    const props = {
      form: createTableView,
      settings: { name: "", filters: DEFAULT_IMAGES_FILTERS },
    };
    const { screen: first } = await renderForm(props);

    await first.getByRole("textbox", { name: "* View name" }).fill("Unsaved");
    await first.getByRole("button", { name: /^Build status/ }).click();
    await first.getByRole("radio", { name: "Failed" }).click();
    await first.unmount();

    const { screen: second } = await renderForm(props);

    await expect
      .element(second.getByRole("textbox", { name: "* View name" }))
      .toHaveValue("");
    await expect
      .element(second.getByRole("button", { name: /^Build status/ }))
      .toHaveTextContent("All");
  });
});

// Kit shares a `.for(id)` form instance while it's in use, so each test gets its own view
let viewCount = 0;

async function renderForm(
  props: Partial<ComponentProps<typeof TableViewEditForm>> = {},
) {
  const onstage = vi.fn();
  const screen = await render(TableViewEditForm, {
    form: editTableView.for(`mine-${viewCount++}`),
    distro: "ubuntu",
    settings,
    heading: "Editing – Mine",
    cancelHref: "?panel=manage-views",
    onstage,
    ...props,
  });
  return { screen, onstage };
}
