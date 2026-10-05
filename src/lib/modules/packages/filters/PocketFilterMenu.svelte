<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import { POCKETS } from "../superhref.js";
  import type { FilterChangeHandler } from "./types.js";

  type Pocket = (typeof POCKETS)[number];

  const {
    form,
    inputName,
    value,
    onchange,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    value: Pocket | null;
    onchange: FilterChangeHandler<Pocket | null>;
    "aria-labelledby": string;
  } = $props();

  const selectedLabel = $derived(value ?? "All");
</script>

<Popover>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {selectedLabel}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Pocket">
      <ContextualMenuContent.RadioItem
        name={inputName}
        value=""
        text="All"
        checked={!value}
        {form}
        onchange={(e) => onchange(e, null)}
      />
      {#each POCKETS as pocket (pocket)}
        <ContextualMenuContent.RadioItem
          name={inputName}
          value={pocket}
          text={pocket}
          checked={value === pocket}
          {form}
          onchange={(e) => onchange(e, pocket)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
