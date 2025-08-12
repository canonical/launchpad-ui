<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { setGroupContext } from "./context.js";
  import type { GroupProps } from "./types.js";

  const componentCssClassName = "ds group";

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
`Group` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Group class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Group>
```
-->

<style>
  .ds.group {
    --color-background-group: var(--tmp-color-background-default);
    --dimension-padding-block-group: var(--tmp-dimension-spacing-block-xs);
    --dimension-margin-block-end-group-legend: var(
      --tmp-dimension-spacing-block-xxs
    );
    --typography-font-group-legend: var(
      --tmp-typography-paragraph-default-small-caps
    );
    --typography-letter-spacing-group-legend: var(
      --tmp-typography-letter-spacing-l
    );
    --color-text-group-legend: var(--tmp-color-text-muted);
    --dimension-padding-inline-group-legend: var(
      --tmp-dimension-spacing-inline-m
    );
    --border-group-separator: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-default);

    padding-inline: 0;
    border: none;

    background-color: var(--color-background-group);
    padding-block: var(--dimension-padding-block-group);

    > legend {
      float: inline-start;
      inline-size: 100%;
      margin-block-end: var(--dimension-margin-block-end-group-legend);
      font: var(--typography-font-group-legend);
      letter-spacing: var(--typography-letter-spacing-group-legend);
      color: var(--color-text-group-legend);
      padding-inline: var(--dimension-padding-inline-group-legend);
    }

    + :global(.ds.group) {
      border-top: var(--border-group-separator);
    }
  }
</style>
