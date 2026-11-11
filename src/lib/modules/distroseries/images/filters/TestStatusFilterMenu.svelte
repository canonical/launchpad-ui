<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "#lib/components/index.ts";
  import { PopoverTrigger } from "#lib/launchpad-components/index.ts";
  import type { ChoiceFilterProps } from "#lib/modules/filtering/types.ts";
  import { TEST_STATUSES } from "../constants";
  import type { TestStatus } from "../types";

  const {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: ChoiceFilterProps<TestStatus | null> = $props();

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
      {#each TEST_STATUSES as testStatus (testStatus)}
        <ContextualMenuContent.RadioItem
          {name}
          value={testStatus}
          text={testStatus.charAt(0).toUpperCase() + testStatus.slice(1)}
          checked={value === testStatus}
          onchange={(e) => onchange?.(e, testStatus)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
