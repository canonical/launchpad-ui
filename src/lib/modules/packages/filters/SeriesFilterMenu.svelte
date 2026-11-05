<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "#lib/components/index.js";
  import { PopoverTrigger } from "#lib/launchpad-components/index.js";
  import type { ChoiceFilterProps, SeriesGroups } from "./types.js";

  const {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
    seriesGroups,
  }: ChoiceFilterProps<string | null> & {
    seriesGroups: SeriesGroups;
  } = $props();

  const selectedSeries = $derived(
    seriesGroups
      .flatMap((group) => group.series)
      .find((series) => series.name === value),
  );
</script>

<Popover {position}>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {selectedSeries?.displayName ?? (value || "All")}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Series">
      <ContextualMenuContent.RadioItem
        {name}
        value=""
        text="All"
        checked={!value}
        onchange={(e) => onchange?.(e, null)}
      />
      {#if value && !selectedSeries}
        <ContextualMenuContent.RadioItem
          {name}
          {value}
          text={value}
          checked
          onchange={(e) => onchange?.(e, value)}
        />
      {/if}
    </ContextualMenuContent.Group>
    {#each seriesGroups as group (group.status)}
      <ContextualMenuContent.Group groupTitle={group.status}>
        {#each group.series as series (series.name)}
          <ContextualMenuContent.RadioItem
            {name}
            value={series.name}
            text={series.displayName}
            checked={value === series.name}
            onchange={(e) => onchange?.(e, series.name)}
          />
        {/each}
      </ContextualMenuContent.Group>
    {/each}
  </ContextualMenuContent>
</Popover>
