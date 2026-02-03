<script lang="ts">
  import { CloseIcon } from "@canonical/svelte-icons";
  import type { ChipProps } from "./types.js";

  const componentCssClassName = "ds chip";

  const {
    class: className,
    density,
    severity,
    readonly,
    lead,
    value,
    icon,
    badge,
    ondismiss,
    onclick,
    ...rest
  }: ChipProps = $props();

  const dismissible = $derived(ondismiss !== undefined);
  const clickable = $derived(onclick !== undefined);

  const rootElement = $derived(
    dismissible || readonly || !clickable ? "span" : "button",
  );
</script>

<svelte:element
  this={rootElement}
  class={[componentCssClassName, className, density, severity, { readonly }]}
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
  {#if badge}
    <span class="badge">
      {@render badge()}
    </span>
  {/if}
  {#if dismissible}
    <button
      class="dismiss"
      onclick={ondismiss}
      aria-label="Dismiss"
      type="button"
    >
      <CloseIcon class="dismiss-icon" />
    </button>
  {/if}
</svelte:element>

<!-- @component
`Chip` displays a small actionable pieces of information.

## Example Usage
```svelte
<Chip value="Value"/>
<Chip lead="Lead" value="Value" />
<Chip lead="Lead" value="Value" severity="caution" />
<Chip
  lead="Lead"
  value="Value"
  readonly
  density="dense"
  severity="caution"
/>
```
-->

<style>
  .ds.chip {
    --color-background-chip-active: var(
      --lp-color-background-secondary-active-context,
      var(--lp-color-background-neutral-active)
    );
    --color-background-chip-hover: var(
      --lp-color-background-secondary-hover-context,
      var(--lp-color-background-neutral-hover)
    );
    --color-background-chip: var(
      --lp-color-background-secondary-context,
      var(--lp-color-background-neutral-default)
    );
    --border-style-chip: solid;
    --color-border-chip: var(
      --lp-color-border-secondary-context,
      var(--lp-color-border-default)
    );
    --dimension-size-chip-close-icon: 0.85rem;
    --dimension-gap-inline-chip: var(--lp-dimension-spacing-inline-xxs);
    --dimension-gap-inline-chip-badge: var(--lp-dimension-spacing-inline-xs)
      var(--lp-dimension-spacing-inline-minimum);
    --dimension-padding-block-chip: var(
      --dimension-padding-block-context,
      var(--lp-dimension-spacing-block-xxxs)
    );
    --dimension-padding-inline-chip: var(
      --dimension-padding-inline-context,
      var(--lp-dimension-spacing-inline-s)
    );
    --dimension-radius-chip: var(--dimension-radius-full);
    --dimension-border-width-chip: var(--dimension-stroke-thickness-default);
    --typography-chip: var(--lp-typography-paragraph-s);
    --typography-letter-spacing-chip-leader: var(
      --lp-typography-letter-spacing-l
    );
    --color-text-chip: var(
      --lp-color-text-secondary-context,
      var(--lp-color-text-default)
    );

    display: inline-flex;
    align-items: center;
    font: var(--typography-chip);
    color: var(--color-text-chip);
    border-radius: var(--dimension-radius-chip);
    border: var(--dimension-border-width-chip) var(--border-style-chip)
      var(--color-border-chip);
    background-color: var(--color-background-chip);
    padding-block: var(--dimension-padding-block-chip);
    padding-inline: var(--dimension-padding-inline-chip);
    transition-duration: var(--lp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--lp-transition-timing-ease-in);

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

      :global(.dismiss-icon) {
        --dimension-size-icon: 100%;
      }
    }

    /* TODO: Consider splitting the chip component into two separate components */
    /* Where the read-only local modifier won't be needed anymore. */
    &.readonly {
      --lp-color-border-secondary-context: var(--lp-color-background-default);
    }
  }
</style>
