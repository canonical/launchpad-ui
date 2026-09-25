<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import { POCKETS } from "../superhref.js";

  const {
    form,
    inputName,
    value,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    value: (typeof POCKETS)[number] | null;
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
        onchange={(e) => e.currentTarget.form?.requestSubmit()}
      />
      {#each POCKETS as pocket (pocket)}
        <ContextualMenuContent.RadioItem
          name={inputName}
          value={pocket}
          text={pocket}
          checked={value === pocket}
          {form}
          onchange={(e) => e.currentTarget.form?.requestSubmit()}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
