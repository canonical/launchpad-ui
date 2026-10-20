<script lang="ts" module>
  import { SEARCH_MATCHES, SEARCH_MODE_LABELS } from "./constants.js";
  import type { SearchMatch } from "./constants.js";

  const searchModes = Object.entries(SEARCH_MODE_LABELS) as [
    SearchMatch,
    string,
  ][];
</script>

<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import type { ChoiceFilterProps } from "./types.js";

  let {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: ChoiceFilterProps<SearchMatch> = $props();

  const selected = $derived(
    SEARCH_MATCHES.find((match) => match === value) ?? "contains",
  );
</script>

<Popover {position}>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {SEARCH_MODE_LABELS[selected]}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Keyword search mode">
      {#each searchModes as [key, label] (key)}
        <ContextualMenuContent.RadioItem
          {name}
          value={key}
          checked={selected === key}
          text={label}
          onchange={(e) => onchange?.(e, key)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
