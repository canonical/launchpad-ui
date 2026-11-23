<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import type { PopoverProps } from "@canonical/svelte-ds-app-launchpad";
  import { FilterIcon } from "@canonical/svelte-icons";
  import { ContextualMenuContent } from "#lib/components/index.js";
  import { PopoverTrigger } from "#lib/launchpad-components/index.js";
  import type { FilterChangeHandler } from "#lib/modules/filtering/types.js";

  const {
    switches,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: {
    switches: {
      name: string;
      text: string;
      checked: boolean;
    }[];
    onchange?: FilterChangeHandler<boolean>;
    position?: PopoverProps["position"];
    "aria-labelledby": string;
  } = $props();

  const activeCount = $derived(
    switches.filter((filter) => filter.checked).length,
  );
  const activeCountId = $props.id();
</script>

<!-- TODO: Rebuild this with the more generic filter component once
https://warthogs.atlassian.net/browse/LP-5118 lands -->

<Popover {position}>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger
      aria-labelledby={activeCount
        ? `${ariaLabelledBy} ${activeCountId}`
        : ariaLabelledBy}
      {...triggerProps}
    >
      {#snippet icon()}
        <div class="indicator" class:show={activeCount > 0}>
          <FilterIcon />
        </div>
        {#if activeCount}
          <span id={activeCountId} class="visually-hidden"
            >{activeCount} active</span
          >
        {/if}
      {/snippet}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="More Filters">
      {#each switches as filter (filter.name)}
        <ContextualMenuContent.SwitchItem
          name={filter.name}
          text={filter.text}
          checked={filter.checked}
          onchange={(e) => onchange?.(e, e.currentTarget.checked)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>

<style>
  .indicator {
    position: relative;

    &.show::after {
      content: "";
      display: block;
      position: absolute;
      inset-block-start: calc(var(--dimension-025) * -1);
      inset-inline-end: calc(var(--dimension-025) * -1);
      inline-size: var(--dimension-100);
      block-size: var(--dimension-100);
      background-color: var(--color-icon-information);
      border-radius: 50%;
    }
  }
</style>
