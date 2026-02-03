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
  {@render children?.()}
  {#if footer || helper}
    <div class="footer">
      {@render helper?.(helperId)}
      {@render footer?.()}
    </div>
  {/if}
</div>

<style>
  .ds.options-panel {
    --color-background-options-panel: var(--lp-color-background-default);
    --border-options-panel: var(--dimension-stroke-thickness-default) solid
      var(--lp-color-border-high-contrast);
    --border-top-options-panel-footer: var(--dimension-stroke-thickness-default)
      solid var(--lp-color-border-high-contrast);

    border: var(--border-options-panel);
    background-color: var(--color-background-options-panel);

    > .footer {
      border-top: var(--border-top-options-panel-footer);
    }
  }
</style>
