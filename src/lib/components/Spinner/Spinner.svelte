<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { SpinnerIcon } from "@canonical/svelte-icons";
  import type { SpinnerProps } from "./types.js";

  const componentCssClassName = "ds spinner";

  let { class: className, ...rest }: SpinnerProps = $props();
</script>

<SpinnerIcon
  name="spinner"
  class={[componentCssClassName, className]}
  aria-label="Loading"
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
    transform-origin: center center;
    animation: loading-spinner var(--lp-transition-duration-sleepy) infinite
      linear;
  }

  @keyframes loading-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
