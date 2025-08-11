<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { IconProps } from "./types.js";

  const componentCssClassName = "ds icon";

  let { class: className, modifiers, name, ...rest }: IconProps = $props();
</script>

<span
  class={[componentCssClassName, className, modifiers]}
  style:--icon-url={`url(/icons/monotone/${name}.svg)`}
  {...rest}
></span>

<!-- @component
`Icon` is a component for displaying monotone icons.

Icons color follows the current text color.

## Example Usage
```svelte
<Icon name="edit"/>
```
-->

<style>
  .ds.icon {
    --dimension-size-icon: var(--tmp-dimension-size-xs);

    display: inline-block;
    background-color: currentColor;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
    mask-mode: alpha;

    width: var(--dimension-size-icon);
    height: var(--dimension-size-icon);
    mask-image: var(--icon-url);

    &.spin {
      animation: spin 1s infinite linear;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
