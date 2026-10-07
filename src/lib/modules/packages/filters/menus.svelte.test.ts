import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { SetupOptions } from "vitest-browser-svelte";
import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
import PocketFilterMenu from "./PocketFilterMenu.svelte";
import SearchModeMenu from "./SearchModeMenu.svelte";
import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
import FiltersFormFixture, {
  FILTER_LABEL_ID,
  submitOnChange,
} from "./test.fixtures.svelte";

const onchange = vi.fn(submitOnChange);
const submissions: [string, string][][] = [];
const formOptions: SetupOptions<typeof FiltersFormFixture> = {
  wrapper: FiltersFormFixture,
  wrapperProps: { label: "Filter:", submissions },
};

beforeEach(() => {
  submissions.length = 0;
  onchange.mockClear();
});

const labelledProps = {
  "aria-labelledby": FILTER_LABEL_ID,
};

const controlProps = { ...labelledProps, onchange };

describe("SeriesFilterMenu", () => {
  it.each([
    [null, "Filter: All", "All"],
    ["noble", "Filter: 24.04 LTS (Noble Numbat)", "24.04 LTS (Noble Numbat)"],
  ])(
    "names the trigger after the selected series (%s) and checks it",
    async (value, triggerName, checkedOption) => {
      const screen = await render(
        SeriesFilterMenu,
        {
          ...controlProps,
          name: "series",
          value,
        },
        formOptions,
      );

      await screen.getByRole("button", { name: triggerName }).click();

      await expect
        .element(screen.getByRole("radio", { name: checkedOption }))
        .toBeChecked();
    },
  );

  it.each([
    [null, "26.04 LTS (Resolute Raccoon)", "resolute", "resolute"],
    ["noble", "All", "", null],
  ])(
    "submits the picked series from %s",
    async (value, option, submitted, changedTo) => {
      const screen = await render(
        SeriesFilterMenu,
        {
          ...controlProps,
          name: "series",
          value,
        },
        formOptions,
      );

      await screen.getByRole("button", { name: /^Filter:/ }).click();
      await screen.getByRole("radio", { name: option }).click();

      expect(onchange).toHaveBeenCalledExactlyOnceWith(
        expect.any(Event),
        changedTo,
      );
      expect(submissions).toEqual([[["series", submitted]]]);
    },
  );
});

describe("PocketFilterMenu", () => {
  it.each([
    [null, "Filter: All", "All"],
    ["Updates", "Filter: Updates", "Updates"],
  ] as const)(
    "names the trigger after the selected pocket (%s) and checks it",
    async (value, triggerName, checkedOption) => {
      const screen = await render(
        PocketFilterMenu,
        {
          ...controlProps,
          name: "pocket",
          value,
        },
        formOptions,
      );

      await screen.getByRole("button", { name: triggerName }).click();

      await expect
        .element(screen.getByRole("radio", { name: checkedOption }))
        .toBeChecked();
    },
  );

  it.each([
    [null, "Proposed", "Proposed", "Proposed"],
    ["Updates", "All", "", null],
  ] as const)(
    "submits the picked pocket from %s",
    async (value, option, submitted, changedTo) => {
      const screen = await render(
        PocketFilterMenu,
        {
          ...controlProps,
          name: "pocket",
          value,
        },
        formOptions,
      );

      await screen.getByRole("button", { name: /^Filter:/ }).click();
      await screen.getByRole("radio", { name: option }).click();

      expect(onchange).toHaveBeenCalledExactlyOnceWith(
        expect.any(Event),
        changedTo,
      );
      expect(submissions).toEqual([[["pocket", submitted]]]);
    },
  );
});

describe("SearchModeMenu", () => {
  it("names the trigger after the selected mode and submits the picked one", async () => {
    const screen = await render(
      SearchModeMenu,
      {
        ...controlProps,
        name: "match",
        value: "contains",
      },
      formOptions,
    );

    await screen.getByRole("button", { name: "Filter: Contain" }).click();
    await expect
      .element(screen.getByRole("radio", { name: "Contain" }))
      .toBeChecked();
    await screen.getByRole("radio", { name: "Exact Match" }).click();

    expect(onchange).toHaveBeenCalledExactlyOnceWith(
      expect.any(Event),
      "exact",
    );
    expect(submissions).toEqual([[["match", "exact"]]]);
  });

  it.each(["", "fuzzy", null])(
    "falls back to Contain for %j",
    async (value) => {
      const screen = await render(
        SearchModeMenu,
        {
          ...controlProps,
          name: "match",
          value,
        },
        formOptions,
      );

      await screen.getByRole("button", { name: "Filter: Contain" }).click();
      await expect
        .element(screen.getByRole("radio", { name: "Contain" }))
        .toBeChecked();
    },
  );
});

describe("MoreFiltersMenu", () => {
  const switches = (ubuntuChange: boolean, allStatuses: boolean) => [
    {
      name: "ubuntu-change",
      text: "Only show packages changed by Ubuntu",
      checked: ubuntuChange,
    },
    {
      name: "all-statuses",
      text: "Include Superseded and Deleted",
      checked: allStatuses,
    },
  ];

  it.each([
    [false, false, "Filter:"],
    [true, false, "Filter: 1 active"],
    [true, true, "Filter: 2 active"],
  ])(
    "announces how many filters are active (%s, %s)",
    async (ubuntuChange, allStatuses, triggerName) => {
      const screen = await render(
        MoreFiltersMenu,
        {
          ...labelledProps,
          switches: switches(ubuntuChange, allStatuses),
        },
        formOptions,
      );

      await expect
        .element(screen.getByRole("button"))
        .toHaveAccessibleName(triggerName);
    },
  );

  it.each([
    [
      "Only show packages changed by Ubuntu",
      [
        ["ubuntu-change", "on"],
        ["all-statuses", "on"],
      ],
    ],
    ["Include Superseded and Deleted", []],
  ])(
    "submits the remaining active filters after toggling %s",
    async (text, submitted) => {
      const screen = await render(
        MoreFiltersMenu,
        {
          ...labelledProps,
          switches: switches(false, true),
        },
        formOptions,
      );

      await screen.getByRole("button", { name: /^Filter:/ }).click();
      await screen.getByRole("switch", { name: text }).click();

      expect(submissions).toEqual([submitted]);
    },
  );
});
