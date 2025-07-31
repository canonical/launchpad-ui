<script lang="ts">
  import { Icon } from "../Icon";
  import "./styles.css";
  import type { ChipProps } from "./types.js";

  const componentCssClassName = "ds chip";

  const {
    id,
    class: className,
    modifiers,
    style,
    value,
    lead,
    // TODO: implement badge component
    // badge,
    icon,
    ...rest
  }: ChipProps = $props();
  const ondismiss = $derived("ondismiss" in rest ? rest.ondismiss : undefined);
  const onclick = $derived("onclick" in rest ? rest.onclick : undefined);
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
  {id}
  {style}
  {onclick}
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
    {@const { value, type = "default", ...badgeProps } = badge}
    <span class={["badge", type]} {...badgeProps}>
      {value}
    </span>
  {/if} -->
  {#if dismissible}
    <button class="dismiss" onclick={ondismiss} aria-label="Dismiss">
      <Icon name="close" />
    </button>
  {/if}
</svelte:element>

<!-- @component
`Chip` displays small actionable pieces of information.

## Example Usage
```svelte
<Chip value="Value"/>
<Chip lead="Lead" value="Value" />
<Chip lead="Lead" value="Value" modifiers={["caution"]} />
<Chip lead="Lead" value="Value" modifiers={["readonly", "dense", "caution"]} />
```
-->
