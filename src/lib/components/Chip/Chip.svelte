<script lang="ts">
  import { Icon } from "../Icon";
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
      --tmp-color-background-secondary-active-context,
      var(--tmp-color-background-neutral-active)
    );
    --color-background-chip-hover: var(
      --tmp-color-background-secondary-hover-context,
      var(--tmp-color-background-neutral-hover)
    );
    --color-background-chip: var(
      --tmp-color-background-secondary-context,
      var(--tmp-color-background-neutral-default)
    );
    --border-style-chip: solid;
    --color-border-chip: var(
      --tmp-color-border-secondary-context,
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
    --color-text-chip: var(
      --tmp-color-text-secondary-context,
      var(--tmp-color-text-default)
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
    transition-duration: var(--tmp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--tmp-transition-timing-ease-in);

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
      --tmp-color-border-secondary-context: var(--tmp-color-background-default);
    }
  }
</style>
