<script lang="ts">
  import { Icon } from "../Icon";
  import "./styles.css";
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
