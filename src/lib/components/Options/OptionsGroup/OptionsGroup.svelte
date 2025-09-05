<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { OptionsGroupProps } from "./types.js";

  const componentCssClassName = "ds options-group";

  let {
    class: className,
    children,
    groupTitle,
    disabled = false,
    ...rest
  }: OptionsGroupProps = $props();
</script>

<fieldset class={[componentCssClassName, className]} {disabled} {...rest}>
  {#if groupTitle}
    <legend>{groupTitle}</legend>
  {/if}
  {@render children?.()}
</fieldset>

<style>
  .ds.options-group {
    --dimension-padding-block-options-group: var(
      --tmp-dimension-spacing-block-xs
    );
    --dimension-margin-block-end-options-group-legend: var(
      --tmp-dimension-spacing-block-xxs
    );
    --typography-font-options-group-legend: var(
      --tmp-typography-paragraph-default-small-caps
    );
    --typography-letter-spacing-options-group-legend: var(
      --tmp-typography-letter-spacing-l
    );
    --color-text-options-group-legend: var(--tmp-color-text-muted);
    --dimension-padding-inline-options-group-legend: var(
      --tmp-dimension-spacing-inline-m
    );
    --border-options-group-separator: var(--dimension-stroke-thickness-default)
      solid var(--tmp-color-border-default);

    padding-inline: 0;
    border: none;

    padding-block: var(--dimension-padding-block-options-group);

    > legend {
      float: inline-start;
      inline-size: 100%;
      margin-block-end: var(--dimension-margin-block-end-options-group-legend);
      font: var(--typography-font-options-group-legend);
      letter-spacing: var(--typography-letter-spacing-options-group-legend);
      color: var(--color-text-options-group-legend);
      padding-inline: var(--dimension-padding-inline-options-group-legend);
    }

    + :global(.ds.options-group) {
      border-top: var(--border-options-group-separator);
    }
  }
</style>
