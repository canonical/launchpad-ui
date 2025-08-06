<script lang="ts">
  import { Icon } from "../Icon";
  import type { ChipProps } from "./types.js";

  const componentCssClassName = "ds chip";

  const {
    class: className,
    modifiers,
    lead,
    value,
    icon,
    // TODO: implement badge component
    // badge,
    ondismiss,
    onclick,
    ...rest
  }: ChipProps = $props();

  const dismissible = $derived(ondismiss !== undefined);
  const isClickable = $derived(onclick !== undefined);
  const isReadonly = $derived(modifiers?.includes("readonly") ?? false);

  const rootElement = $derived(
    dismissible || isReadonly || !isClickable ? "span" : "button",
  );
</script>

<svelte:element
  this={rootElement}
  class={[componentCssClassName, className, modifiers]}
  type={rootElement === "button" ? "button" : undefined}
  {onclick}
  data-testid="chip"
  {...rest}
>
  {#if icon}
    <span class="icon">
      {@render icon()}
    </span>
  {/if}
  {#if lead}
    <span class="lead">
      {lead}
    </span>
  {/if}
  <span class="value">
    {value}
  </span>
  <!-- TODO: implement badge component -->
  <!-- {#if badge}
   ...
  {/if} -->
  {#if dismissible}
    <button
      class="dismiss"
      onclick={ondismiss}
      aria-label="Dismiss"
      type="button"
    >
      <Icon name="close" />
    </button>
  {/if}
</svelte:element>

<!-- @component
`Chip` displays a small actionable pieces of information.

## Example Usage
```svelte
<Chip value="Value"/>
<Chip lead="Lead" value="Value" />
<Chip lead="Lead" value="Value" modifiers={["caution"]} />
<Chip lead="Lead" value="Value" modifiers={["readonly", "dense", "caution"]} />
```
-->

<style>
  .ds.chip {
    --color-background-chip-active: var(
      --tmp-color-background-active-context,
      var(--tmp-color-background-neutral-active)
    );
    --color-background-chip-hover: var(
      --tmp-color-background-hover-context,
      var(--tmp-color-background-neutral-hover)
    );
    --color-background-chip: var(
      --tmp-color-background-context,
      var(--tmp-color-background-neutral-default)
    );
    --border-style-chip: solid;
    --color-border-chip: var(
      --tmp-color-border-context,
      var(--tmp-color-border-default)
    );
    --dimension-size-chip-close-icon: 0.85rem;
    --dimension-gap-inline-chip: var(--tmp-dimension-spacing-inline-xxs);
    --dimension-gap-inline-chip-badge: var(--tmp-dimension-spacing-inline-xs)
      var(--tmp-dimension-spacing-inline-minimum);
    --dimension-padding-block-chip: var(
      --dimension-padding-block-context,
      var(--tmp-dimension-spacing-block-xxxs)
    );
    --dimension-padding-inline-chip: var(
      --dimension-padding-inline-context,
      var(--tmp-dimension-spacing-inline-s)
    );
    --dimension-radius-chip: var(--dimension-radius-full);
    --dimension-border-width-chip: var(--dimension-stroke-thickness-default);
    --typography-chip: var(--tmp-typography-paragraph-s);
    --typography-letter-spacing-chip-leader: var(
      --tmp-typography-letter-spacing-l
    );

    display: inline-flex;
    align-items: center;
    font: var(--typography-chip);
    border-radius: var(--dimension-radius-chip);
    border: var(--dimension-border-width-chip) var(--border-style-chip)
      var(--color-border-chip);
    background-color: var(--color-background-chip);
    padding-block: var(--dimension-padding-block-chip);
    padding-inline: var(--dimension-padding-inline-chip);

    &:is(button),
    .dismiss {
      cursor: pointer;

      &:hover {
        background-color: var(--color-background-chip-hover);
      }

      &:active {
        background-color: var(--color-background-chip-active);
      }
    }

    > .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--dimension-gap-inline-chip);
    }

    > .lead {
      font-variant-caps: all-small-caps;
      font-variant-numeric: oldstyle-nums;
      letter-spacing: var(--typography-letter-spacing-chip-leader);

      & + .value::before {
        content: ": ";
      }
    }

    > .badge {
      margin-inline: var(--dimension-gap-inline-chip-badge);
    }

    > .dismiss {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      cursor: pointer;
      border-radius: var(--dimension-radius-full);
      width: var(--dimension-size-chip-close-icon);
      height: var(--dimension-size-chip-close-icon);
      margin-left: var(--dimension-gap-inline-chip);
      border: var(--dimension-stroke-thickness-default) solid transparent;

      :global(.ds.icon) {
        --dimension-size-icon: 100%;
      }
    }

    /* TODO: Consider splitting the chip component into two separate components */
    /* Where the read-only local modifier won't be needed anymore. */
    &.readonly {
      --tmp-color-border-context: var(--tmp-color-background-default);
    }
  }
</style>
