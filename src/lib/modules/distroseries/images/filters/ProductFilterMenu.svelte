<script lang="ts">
  import { Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ContextualMenuContent } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import type { ChoiceFilterProps } from "$lib/modules/filtering/types.js";
  import { PRODUCTS } from "../constants.js";
  import type { Product } from "../types.js";

  const {
    name,
    value,
    onchange,
    position,
    "aria-labelledby": ariaLabelledBy,
  }: ChoiceFilterProps<Product | null> = $props();

  const selectedLabel = $derived(
    PRODUCTS.find((product) => product.slug === value)?.name ?? "All",
  );
</script>

<Popover {position}>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {selectedLabel}
    </PopoverTrigger>
  {/snippet}
  <ContextualMenuContent>
    <ContextualMenuContent.Group groupTitle="Product">
      <ContextualMenuContent.RadioItem
        {name}
        value=""
        text="All"
        checked={!value}
        onchange={(e) => onchange?.(e, null)}
      />
      {#each PRODUCTS as product (product)}
        <ContextualMenuContent.RadioItem
          {name}
          value={product.slug}
          text={product.name}
          checked={value === product.slug}
          onchange={(e) => onchange?.(e, product.slug)}
        />
      {/each}
    </ContextualMenuContent.Group>
  </ContextualMenuContent>
</Popover>
