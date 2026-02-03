<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { HeaderProps } from "./types.js";

  const componentCssClassName = "ds markdown-editor-header";

  let { class: className, children, controls, ...rest }: HeaderProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="markdown-editor-header"
  {...rest}
>
  {#if children}
    <div class="actions">
      {@render children()}
    </div>
  {/if}
  {#if controls}
    <div class="controls">
      {@render controls()}
    </div>
  {/if}
</div>

<style>
  .ds.markdown-editor-header {
    --dimension-padding-block-markdown-editor-header: var(
      --lp-dimension-spacing-block-xxs
    );
    --dimension-padding-inline-markdown-editor-header: var(
      --lp-dimension-spacing-inline-xs
    );
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: var(--dimension-padding-block-markdown-editor-header);
    padding-inline: var(--dimension-padding-inline-markdown-editor-header);
  }
</style>
