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
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
