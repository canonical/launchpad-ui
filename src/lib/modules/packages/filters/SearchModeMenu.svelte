<script lang="ts" module>
  import type { SEARCH_MATCHES } from "../superhref.js";

  const searchModeLabels = {
    contains: "Contain",
    exact: "Exact Match",
  } as const satisfies Record<(typeof SEARCH_MATCHES)[number], string>;
</script>

<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { InformationIcon } from "@canonical/svelte-icons";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";

  let {
    form,
    inputName,
    value,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    value: (typeof SEARCH_MATCHES)[number];
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
      {#each Object.entries(searchModeLabels) as [key, label] (key)}
        <ContextualMenuContent.RadioItem
          name={inputName}
          value={key}
          checked={value === key}
          text={label}
          {form}
          onchange={(e) => e.currentTarget.form?.requestSubmit()}
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
