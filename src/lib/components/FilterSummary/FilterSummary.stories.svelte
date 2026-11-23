<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { EditIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { activeFilters, config } from "./test.fixtures.svelte";
  import { FilterSummary } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/FilterSummary",
    tags: ["autodocs"],
    component: FilterSummary,
    args: {
      config,
      filters: activeFilters,
    },
    argTypes: {
      actions: { control: false },
      children: { control: false },
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <FilterSummary {...args} />
  {/snippet}
</Story>

<Story name="With actions">
  {#snippet template(args)}
    <FilterSummary {...args}>
      {#snippet actions()}
        <Button importance="tertiary">
          {#snippet iconLeft()}<EditIcon />{/snippet}
        </Button>
      {/snippet}
    </FilterSummary>
  {/snippet}
</Story>

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
