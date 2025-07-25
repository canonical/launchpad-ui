<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { IconProps } from "./types.js";
  import "./styles.css";

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
