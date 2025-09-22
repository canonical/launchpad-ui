<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { GroupProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-toolbar-group";

  let { class: className, children, ...rest }: GroupProps = $props();
</script>

<div class={[componentCssClassName, className]} role="group" {...rest}>
  {@render children?.()}
</div>

<style>
  .ds.markdown-editor-toolbar-group {
    --color-border-markdown-editor-toolbar-group: var(
      --tmp-color-border-default
    );
    --dimension-size-markdown-editor-toolbar-group-separator: var(
      --tmp-dimension-size-s
    );
    --dimension-stroke-thickness-markdown-editor-toolbar-group-separator: var(
      --dimension-stroke-thickness-default
    );

    display: flex;
    align-items: center;
    flex-direction: row;

    :global(&:has(~ .ds.markdown-editor-toolbar-group))::after {
      content: "";
      display: inline-block;
      border-inline-end: var(
          --dimension-stroke-thickness-markdown-editor-toolbar-group-separator
        )
        solid var(--color-border-markdown-editor-toolbar-group);
      height: var(--dimension-size-markdown-editor-toolbar-group-separator);
      padding-inline-start: var(--dimension-gap-markdown-editor-toolbar);
      width: 0;
    }
  }
</style>
