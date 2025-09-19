<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { SeparatorProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-separator";

  let { class: className, ...rest }: SeparatorProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  role="separator"
  {...rest}
></div>

<style>
  .ds.markdown-editor-toolbar-separator {
    --color-background-toolbar-separator: var(--tmp-color-border-default);
    --dimension-size-toolbar-separator: var(--tmp-dimension-size-s);
    --dimension-stroke-thickness-toolbar-separator: var(
      --dimension-stroke-thickness-default
    );

    background-color: var(--color-background-toolbar-separator);
    border-left-color: var(--color-background-toolbar-separator);
    border-left-style: solid;
    border-left-width: var(--dimension-stroke-thickness-toolbar-separator);
    display: inline-block;
    height: var(--dimension-size-toolbar-separator);
    width: 0;
  }
</style>
