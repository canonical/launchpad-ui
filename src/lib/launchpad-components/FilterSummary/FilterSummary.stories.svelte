<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import type { Component } from "svelte";
  import FilterSummary from "./FilterSummary.svelte";
  import { activeFilters, config } from "./test.fixtures.js";
  import type { TaskFilters } from "./test.fixtures.js";
  import type { FilterSummaryProps } from "./types.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/FilterSummary",
    tags: ["autodocs"],
    component: FilterSummary as Component<FilterSummaryProps<TaskFilters>>,
    args: {
      config,
      filters: activeFilters,
      tableViewName: "Tasks",
    },
  });
</script>

<Story name="Default" />

<Story name="With edit button" args={{ editTableViewHref: "#edit" }} />

<Story name="Grouped" args={{ groups: [["search"]] }} />
