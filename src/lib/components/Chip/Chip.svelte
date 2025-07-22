<script lang="ts">
  /* @canonical/generator-ds 0.9.1-experimental.0 */
  import "./styles.css";
  import type { ChipProps } from "./types.js";

  const componentCssClassName = "ds chip";

  let {
    id,
    class: className,
    modifiers,
    style,
    value,
    key,
    badge,
    icon,
    isReadonly = false,
    ...rest
  }: ChipProps = $props();

  const isDismissable = "onDismiss" in rest;

  const rootElement = isDismissable || isReadonly ? "span" : "button";
</script>

<svelte:element
  this={rootElement}
  class={[
    componentCssClassName,
    className,
    modifiers,
    { "is-read-only": isReadonly },
  ]}
  {id}
  {style}
>
  {#if icon}
    <span class="icon">
      {@render icon()}
    </span>
  {/if}
  {#if key}
    <span class="lead">
      {key}
    </span>
  {/if}
  <span class="value">
    {value}
  </span>
  {#if badge}
    {@const { value, type = "default", ...badgeProps } = badge}
    <span class={["badge", type]} {...badgeProps}>
      {value}
    </span>
  {/if}
  {#if isDismissable}
    <button class="dismiss">
      <!-- TODO: use a proper icon once SVG icons are implemented -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          fill-rule="nonzero"
          d="M13.041 1.898l1.06 1.06L9.062 8l5.04 5.042-1.06 1.06L8 9.062 2.96 14.1l-1.06-1.06L6.938 8 1.9 2.96l1.06-1.06 5.04 5.04z"
        ></path>
      </svg>
    </button>
  {/if}
</svelte:element>

<!-- @component
`Chip` displays small actionable pieces of information.

## Example Usage
```svelte
<Chip value="Value"/>
```
-->
