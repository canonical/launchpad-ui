import { beforeEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import MoreFiltersMenu from "./MoreFiltersMenu.svelte";
import PocketFilterMenu from "./PocketFilterMenu.svelte";
import SearchModeMenu from "./SearchModeMenu.svelte";
import SeriesFilterMenu from "./SeriesFilterMenu.svelte";
import {
  FILTERS_FORM_ID,
  FILTER_LABEL_ID,
  mountFiltersForm,
} from "./test.fixtures.js";

const controlProps = {
  form: FILTERS_FORM_ID,
  "aria-labelledby": FILTER_LABEL_ID,
};

describe("SeriesFilterMenu", () => {
  let submissions: [string, string][][];
  beforeEach(() => {
    submissions = mountFiltersForm("Series:");
  });

  it.each([
    [null, "Series: All", "All"],
    ["noble", "Series: 24.04 LTS (Noble Numbat)", "24.04 LTS (Noble Numbat)"],
  ])(
    "names the trigger after the selected series (%s) and checks it",
    async (value, triggerName, checkedOption) => {
      const screen = await render(SeriesFilterMenu, {
        ...controlProps,
        inputName: "series",
        value,
      });

      await screen.getByRole("button", { name: triggerName }).click();

      await expect
        .element(screen.getByRole("radio", { name: checkedOption }))
        .toBeChecked();
    },
  );

  it.each([
    [null, "26.04 LTS (Resolute Raccoon)", "resolute"],
    ["noble", "All", ""],
  ])("submits the picked series from %s", async (value, option, submitted) => {
    const screen = await render(SeriesFilterMenu, {
      ...controlProps,
      inputName: "series",
      value,
    });

    await screen.getByRole("button", { name: /^Series:/ }).click();
    await screen.getByRole("radio", { name: option }).click();

    expect(submissions).toEqual([[["series", submitted]]]);
  });
});

describe("PocketFilterMenu", () => {
  let submissions: [string, string][][];
  beforeEach(() => {
    submissions = mountFiltersForm("Pocket:");
  });

  it.each([
    [null, "Pocket: All", "All"],
    ["Updates", "Pocket: Updates", "Updates"],
  ] as const)(
    "names the trigger after the selected pocket (%s) and checks it",
    async (value, triggerName, checkedOption) => {
      const screen = await render(PocketFilterMenu, {
        ...controlProps,
        inputName: "pocket",
        value,
      });

      await screen.getByRole("button", { name: triggerName }).click();

      await expect
        .element(screen.getByRole("radio", { name: checkedOption }))
        .toBeChecked();
    },
  );

  it.each([
    [null, "Proposed", "Proposed"],
    ["Updates", "All", ""],
  ] as const)(
    "submits the picked pocket from %s",
    async (value, option, submitted) => {
      const screen = await render(PocketFilterMenu, {
        ...controlProps,
        inputName: "pocket",
        value,
      });

      await screen.getByRole("button", { name: /^Pocket:/ }).click();
      await screen.getByRole("radio", { name: option }).click();

      expect(submissions).toEqual([[["pocket", submitted]]]);
    },
  );
});

describe("SearchModeMenu", () => {
  let submissions: [string, string][][];
  beforeEach(() => {
    submissions = mountFiltersForm("Search mode:");
  });

  it("names the trigger after the selected mode and submits the picked one", async () => {
    const screen = await render(SearchModeMenu, {
      ...controlProps,
      inputName: "match",
      value: "contains",
    });

    await screen.getByRole("button", { name: "Search mode: Contain" }).click();
    await expect
      .element(screen.getByRole("radio", { name: "Contain" }))
      .toBeChecked();
    await screen.getByRole("radio", { name: "Exact Match" }).click();

    expect(submissions).toEqual([[["match", "exact"]]]);
  });
});

describe("MoreFiltersMenu", () => {
  let submissions: [string, string][][];
  beforeEach(() => {
    submissions = mountFiltersForm("More filters:");
  });

  const switches = (ubuntuChange: boolean, allStatuses: boolean) => [
    {
      inputName: "ubuntu-change",
      text: "Only show packages changed by Ubuntu",
      checked: ubuntuChange,
    },
    {
      inputName: "all-statuses",
      text: "Include Superseded and Deleted",
      checked: allStatuses,
    },
  ];

  it.each([
    [false, false, "More filters:"],
    [true, false, "More filters: 1 active"],
    [true, true, "More filters: 2 active"],
  ])(
    "announces how many filters are active (%s, %s)",
    async (ubuntuChange, allStatuses, triggerName) => {
      const screen = await render(MoreFiltersMenu, {
        ...controlProps,
        switches: switches(ubuntuChange, allStatuses),
      });

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
      const screen = await render(MoreFiltersMenu, {
        ...controlProps,
        switches: switches(false, true),
      });

      await screen.getByRole("button", { name: /^More filters:/ }).click();
      await screen.getByRole("switch", { name: text }).click();

      expect(submissions).toEqual([submitted]);
    },
  );
});
