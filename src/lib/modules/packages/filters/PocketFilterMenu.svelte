<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import { POCKETS } from "./constants.js";
  import type { ChoiceFilterProps } from "./types.js";

  type Pocket = (typeof POCKETS)[number];

  const {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: ChoiceFilterProps<Pocket | null> = $props();

  const selectedLabel = $derived(value || "All");
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
      {#each POCKETS as pocket (pocket)}
        <ContextualMenuContent.RadioItem
          {name}
          value={pocket}
          text={pocket}
          checked={value === pocket}
          onchange={(e) => onchange?.(e, pocket)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
