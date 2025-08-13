<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { HelperProps } from "./types.js";

  const componentCssClassName = "ds contextual-menu-content-helper";

  let { class: className, children, icon, ...rest }: HelperProps = $props();
</script>

<div class={[componentCssClassName, className]} data-testid="helper" {...rest}>
  {@render icon?.()}
  {@render children()}
</div>

<!-- @component
`ContextualMenuContent.Helper` renders a helper/footer row at the bottom of the menu. To associate it's content with the menu, forward the `id` provided as the snippet argument.

## Example Usage
```svelte
<ContextualMenuContent>
  {#snippet helper(id)}
    <ContextualMenuContent.Helper {id}>
      Use the options above to customize the view
    </ContextualMenuContent.Helper>
  {/snippet}
</ContextualMenuContent>
```
-->

<style>
  .ds.contextual-menu-content-helper {
    --color-background-contextual-menu-content-helper: var(
      --tmp-color-background-default
    );
    --dimension-padding-inline-contextual-menu-content-helper: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-contextual-menu-content-helper: var(
      --tmp-dimension-spacing-block-xs
    );
    --border-top-contextual-menu-content-helper: var(
        --dimension-stroke-thickness-default
      )
      solid var(--tmp-color-border-high-contrast);
    --dimension-gap-contextual-menu-content-helper: var(
      --tmp-dimension-spacing-inline-xs
    );

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--dimension-gap-contextual-menu-content-helper);

    background-color: var(--color-background-contextual-menu-content-helper);
    padding-inline: var(
      --dimension-padding-inline-contextual-menu-content-helper
    );
    padding-block: var(
      --dimension-padding-block-contextual-menu-content-helper
    );
    border-top: var(--border-top-contextual-menu-content-helper);
  }
</style>
