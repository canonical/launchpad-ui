<script lang="ts" module>
  import type { SEARCH_MATCHES } from "../superhref.js";

  type SearchMatch = (typeof SEARCH_MATCHES)[number];

  const searchModeLabels = {
    contains: "Contain",
    exact: "Exact Match",
  } as const satisfies Record<SearchMatch, string>;

  const searchModes = Object.entries(searchModeLabels) as [
    SearchMatch,
    string,
  ][];
</script>

<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { InformationIcon } from "@canonical/svelte-icons";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import type { FilterChangeHandler } from "./packages-filters.js";

  let {
    form,
    inputName,
    value,
    onchange,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    value: SearchMatch;
    onchange: FilterChangeHandler<SearchMatch>;
    "aria-labelledby": string;
  } = $props();
</script>

<Popover>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {searchModeLabels[value]}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Keyword search mode">
      {#each searchModes as [key, label] (key)}
        <ContextualMenuContent.RadioItem
          name={inputName}
          value={key}
          checked={value === key}
          text={label}
          {form}
          onchange={(e) => onchange(e, key)}
        />
      {/each}
    </ContextualMenuContent.Group>
    {#snippet helper(id)}
      <ContextualMenuContent.Helper {id}>
        {#snippet icon()}
          <InformationIcon />
        {/snippet}
        You can search both source package and binary package names
      </ContextualMenuContent.Helper>
    {/snippet}
  </ContextualMenuContent>
</Popover>
