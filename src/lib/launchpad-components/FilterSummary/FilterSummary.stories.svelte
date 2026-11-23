<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { activeFilters, config } from "./test.fixtures.svelte";
  import { FilterSummary } from "./index.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/FilterSummary",
    tags: ["autodocs"],
    component: FilterSummary,
    args: {
      config,
      filters: activeFilters,
      tableViewName: "Tasks",
    },
    argTypes: {
      children: { control: false },
    },
  });
</script>

<Story name="Default" />

<Story name="With edit button" args={{ editTableViewHref: "#edit" }} />

<Story name="Consumer-defined groups">
  {#snippet template(args)}
    <FilterSummary {...args}>
      {#snippet children(parts)}
        <FilterSummary.Group
          parts={parts.filter((part) => part.key === "search")}
        />
        <FilterSummary.Group
          parts={parts.filter((part) => part.key !== "search")}
        />
      {/snippet}
    </FilterSummary>
  {/snippet}
</Story>
