<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { setGroupContext } from "./context.js";
  import type { GroupProps } from "./types.js";

  const componentCssClassName = "ds contextual-menu-content-group";

  let {
    class: className,
    children,
    groupTitle,
    disabled = false,
    ...rest
  }: GroupProps = $props();

  setGroupContext({
    get disabled() {
      return Boolean(disabled);
    },
  });
</script>

<fieldset class={[componentCssClassName, className]} {disabled} {...rest}>
  {#if groupTitle}
    <legend>{groupTitle}</legend>
  {/if}
  {@render children?.()}
</fieldset>

<!-- @component
`ContextualMenuContent.Group` groups related menu items under an optional title. Can disable all nested items via the `disabled` prop.

## Example Usage
```svelte
<ContextualMenuContent.Group groupTitle="Diff layout">
  <ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" />
  <ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
</ContextualMenuContent.Group>
```
-->

<style>
  .ds.contextual-menu-content-group {
    --color-background-contextual-menu-content-group: var(
      --tmp-color-background-default
    );
    --dimension-padding-block-contextual-menu-content-group: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-margin-block-end-contextual-menu-content-group-legend: var(
      --tmp-dimension-spacing-block-xxs
    );
    --typography-font-contextual-menu-content-group-legend: var(
      --tmp-typography-paragraph-default-small-caps
    );
    --typography-letter-spacing-contextual-menu-content-group-legend: var(
      --tmp-typography-letter-spacing-l
    );
    --color-text-contextual-menu-content-group-legend: var(
      --tmp-color-text-muted
    );
    --dimension-padding-inline-contextual-menu-content-group-legend: var(
      --tmp-dimension-spacing-inline-m
    );
    --border-contextual-menu-content-group-separator: var(
        --dimension-stroke-thickness-default
      )
      solid var(--tmp-color-border-default);

    padding-inline: 0;
    border: none;

    background-color: var(--color-background-contextual-menu-content-group);
    padding-block: var(--dimension-padding-block-contextual-menu-content-group);

    > legend {
      float: inline-start;
      inline-size: 100%;
      margin-block-end: var(
        --dimension-margin-block-end-contextual-menu-content-group-legend
      );
      font: var(--typography-font-contextual-menu-content-group-legend);
      letter-spacing: var(
        --typography-letter-spacing-contextual-menu-content-group-legend
      );
      color: var(--color-text-contextual-menu-content-group-legend);
      padding-inline: var(
        --dimension-padding-inline-contextual-menu-content-group-legend
      );
    }

    + :global(.ds.contextual-menu-content-group) {
      border-top: var(--border-contextual-menu-content-group-separator);
    }
  }
</style>
