<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { MulticolorIconProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds multicolor-icon";

  let { class: className, name, ...rest }: MulticolorIconProps = $props();
</script>

<span
  class={[componentCssClassName, className]}
  style:--icon-url={`url(/icons/multicolor/${name}.svg)`}
  {...rest}
></span>

<!-- @component
`MulticolorIcon` is a component for displaying multicolor icons.

Multicolor icons bring their own colors and are not affected by the styling.

## Example Usage
```svelte
<MulticolorIcon name="error"/>
```
-->
