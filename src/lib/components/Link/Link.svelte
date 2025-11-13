<!-- @canonical/generator-ds 0.10.0-experimental.4 -->

<script lang="ts">
  import type { LinkProps } from "./types.js";

  const componentCssClassName = "ds link";

  let { class: className, children, soft, ...rest }: LinkProps = $props();
</script>

<a class={[componentCssClassName, className, { soft }]} {...rest}>
  {@render children?.()}
</a>

<!-- @component
`Link` is a styled anchor element.

## Example Usage
```svelte
<Link href="https://ubuntu.com" target="_blank" rel="noopener">
  Canonical
</Link>
```
-->

<style>
  .ds.link {
    --color-text-link: var(--tmp-color-text-link-default);
    --color-text-link-visited: var(--tmp-color-text-link-visited);
    --text-decoration-link: none;
    --text-decoration-link-hover: underline;

    outline-offset: 0px;
    text-decoration: var(--text-decoration-link);
    color: var(--color-text-link);

    &:visited {
      color: var(--color-text-link-visited);
    }

    &:hover {
      text-decoration: var(--text-decoration-link-hover);
    }

    &.soft {
      color: inherit;
    }
  }
</style>
