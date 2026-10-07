<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { OptionsPanelProps } from "./types.js";

  const componentCssClassName = "ds options-panel";

  let {
    class: className,
    children,
    helper,
    footer,
    ...rest
  }: OptionsPanelProps = $props();

  const helperId = $props.id();
</script>

<div
  class={[componentCssClassName, className]}
  aria-describedby={helper ? helperId : undefined}
  data-testid="options-panel"
  {...rest}
>
  {#if children}
    <div class="content">
      {@render children()}
    </div>
  {/if}
  {#if footer || helper}
    <div class="footer">
      {@render helper?.(helperId)}
      {@render footer?.()}
    </div>
  {/if}
</div>

<style>
  .ds.options-panel {
    isolation: isolate;
    width: 278px;

    border: var(--dimension-stroke-thickness-medium) solid var(--color-border);
    background-color: var(--color-background);

    > .content {
      max-height: 300px;
      overflow: auto;
    }

    > .footer {
      border-top: var(--dimension-stroke-thickness-medium) solid
        var(--color-border);
      background-color: var(--color-background);
    }
  }
</style>
