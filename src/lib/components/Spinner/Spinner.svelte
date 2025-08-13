<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Icon } from "../Icon/index.js";
  import type { SpinnerProps } from "./types.js";

  const componentCssClassName = "ds spinner";

  let {
    class: className,
    "aria-label": ariaLabel,
    ...rest
  }: SpinnerProps = $props();
</script>

<Icon
  name="spinner"
  class={[componentCssClassName, className]}
  aria-label={ariaLabel || "Loading"}
  {...rest}
/>

<!-- @component
`Spinner` A loading icon indicator.

## Example Usage
```svelte
<Spinner />
```
-->

<style>
  :global(.ds.spinner) {
    animation: spin 1s infinite linear;
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
