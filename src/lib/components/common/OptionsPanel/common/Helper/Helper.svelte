<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { HelperProps } from "./types.js";

  const componentCssClassName = "ds options-panel-helper";

  let { class: className, children, icon, ...rest }: HelperProps = $props();
</script>

<div class={[componentCssClassName, className]} data-testid="helper" {...rest}>
  {@render icon?.()}
  {@render children()}
</div>

<style>
  .ds.options-panel-helper {
    --dimension-padding-inline-options-panel-helper: var(
      --lp-dimension-spacing-inline-m
    );
    --dimension-padding-block-options-panel-helper: var(
      --lp-dimension-spacing-block-xs
    );
    --dimension-gap-options-panel-helper: var(--lp-dimension-spacing-inline-xs);

    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--dimension-gap-options-panel-helper);

    padding-inline: var(--dimension-padding-inline-options-panel-helper);
    padding-block: var(--dimension-padding-block-options-panel-helper);
  }
</style>
