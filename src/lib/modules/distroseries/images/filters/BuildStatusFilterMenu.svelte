<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "#lib/components/index.ts";
  import { PopoverTrigger } from "#lib/launchpad-components/index.ts";
  import type { ChoiceFilterProps } from "#lib/modules/filtering/types.ts";
  import { BUILD_STATUSES } from "../constants";
  import type { BuildStatus } from "../types";

  const {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: ChoiceFilterProps<BuildStatus | null> = $props();

  const selectedLabel = $derived(
    value ? value.charAt(0).toUpperCase() + value.slice(1) : "All",
  );
</script>

<Popover {position}>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {selectedLabel}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Pocket">
      <ContextualMenuContent.RadioItem
        {name}
        value=""
        text="All"
        checked={!value}
        onchange={(e) => onchange?.(e, null)}
      />
      {#each BUILD_STATUSES as buildStatus (buildStatus)}
        <ContextualMenuContent.RadioItem
          {name}
          value={buildStatus}
          text={buildStatus.charAt(0).toUpperCase() + buildStatus.slice(1)}
          checked={value === buildStatus}
          onchange={(e) => onchange?.(e, buildStatus)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
