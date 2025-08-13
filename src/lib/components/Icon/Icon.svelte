<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { IconProps } from "./types.js";

  const componentCssClassName = "ds icon";

  let { class: className, name, ...rest }: IconProps = $props();
</script>

<span
  class={[componentCssClassName, className]}
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
    flex-shrink: 0;
    flex-grow: 0;

    width: var(--dimension-size-icon);
    height: var(--dimension-size-icon);
    mask-image: var(--icon-url);
  }
</style>
