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
    --color-background-markdown-editor-toolbar-group-separator: var(
      --tmp-color-border-default
    );
    --dimension-height-markdown-editor-toolbar-group-separator: var(
      --tmp-dimension-size-s
    );
    --dimension-width-markdown-editor-toolbar-group-separator: var(
      --dimension-stroke-thickness-default
    );

    display: flex;
    align-items: center;
    flex-direction: row;
    position: relative;
    :global(&:has(+ .ds.markdown-editor-toolbar-group))::after {
      content: "";
      position: absolute;
      right: calc(
        (
            var(--dimension-gap-markdown-editor-toolbar) +
              var(--dimension-width-markdown-editor-toolbar-group-separator)
          ) /
          -2
      );
      top: 50%;
      transform: translateY(-50%);
      width: var(--dimension-width-markdown-editor-toolbar-group-separator);
      height: var(--dimension-height-markdown-editor-toolbar-group-separator);
      background-color: var(
        --color-background-markdown-editor-toolbar-group-separator
      );
    }
  }
</style>
