<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setPaginationContext } from "./context.js";
  import type { PaginationProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination";

  let {
    class: className,
    tableId,
    children,
    leftGroup,
    rightGroup,
    ...rest
  }: PaginationProps = $props();

  setPaginationContext({
    get tableId() {
      return tableId;
    },
  });
</script>

<nav class={[componentCssClassName, className]} {...rest}>
  {#if leftGroup}
    <div class="left-group">
      {@render leftGroup()}
    </div>
  {/if}
  <div class="right-group">
    {#if rightGroup}
      <div class="right-group-content">
        {@render rightGroup()}
      </div>
    {/if}
    <div class="page-navigation">
      {@render children()}
    </div>
  </div>
</nav>

<!-- @component
`Pagination` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Pagination class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Pagination>
```
-->
