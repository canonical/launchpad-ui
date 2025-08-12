<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { ContextualMenuProps } from "./types.js";

  const componentCssClassName = "ds contextual-menu-content";

  let {
    class: className,
    children,
    helper,
    ...rest
  }: ContextualMenuProps = $props();

  const helperId = $props.id();
</script>

<div
  class={[componentCssClassName, className]}
  aria-describedby={helper ? helperId : undefined}
  data-testid="contextual-menu-content"
  {...rest}
>
  {@render children?.()}
  {@render helper?.(helperId)}
</div>

<!-- @component
`ContextualMenuContent` is the container for contextual menu groups and items. It renders its children and an optional helper footer used to provide additional context for the menu.

## Example Usage
```svelte
<ContextualMenuContent>
  <ContextualMenuContent.Group groupTitle="Preferences">
    <ContextualMenuContent.CheckboxItem text="Show whitespace" />
  </ContextualMenuContent.Group>

  {#snippet helper(id)}
    <ContextualMenuContent.Helper {id}>
      Use the options above to customize the view
    </ContextualMenuContent.Helper>
  {/snippet}
</ContextualMenuContent>
```
-->

<style>
  .ds.contextual-menu-content {
    --border-contextual-menu-content: var(--dimension-stroke-thickness-default)
      solid var(--tmp-color-border-high-contrast);

    border: var(--border-contextual-menu-content);
  }
</style>
