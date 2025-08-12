<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { ContentProps } from "./types.js";

  const componentCssClassName = "ds button-content";

  let {
    class: className,
    children,
    iconLeft,
    iconRight,
    ...rest
  }: ContentProps = $props();
</script>

<div class={[componentCssClassName, className]} {...rest}>
  {#if iconLeft}
    <span class="icon left">
      {@render iconLeft()}
    </span>
  {/if}
  <span class="text">
    {@render children?.()}
  </span>
  {#if iconRight}
    <span class="icon right">
      {@render iconRight()}
    </span>
  {/if}
</div>

<style>
  .ds.button-content {
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    grid-auto-rows: minmax(1lh, auto);
    align-items: center;

    gap: var(--dimension-gap-inline-icon);
    padding-block: var(--dimension-padding-block-button);
    padding-inline: var(--dimension-padding-inline-button);
    --icon-padding-subtract: calc(var(--dimension-padding-inline-button) / 2);

    > .icon {
      display: inline-flex;
      width: var(--dimension-size-button-icon);
      height: var(--dimension-size-button-icon);

      :global(.ds.icon) {
        --dimension-size-icon: 100%;
      }
    }

    /* icon inline center within the padding */
    &:has(.text:not(:empty)) > .icon {
      &.left {
        margin-inline-start: calc(var(--icon-padding-subtract) * -1);
      }
      &.right {
        margin-inline-end: calc(var(--icon-padding-subtract) * -1);
      }
    }

    &:has(.text:empty) {
      &:has(.icon.left) {
        padding-inline-start: 0;
      }
      &:has(.icon.right) {
        padding-inline-end: 0;
      }

      > .icon {
        &.left {
          margin-inline-start: var(--icon-padding-subtract);
          margin-inline-end: calc(var(--icon-padding-subtract) * -1);
        }
        &.right {
          margin-inline-end: var(--icon-padding-subtract);
          margin-inline-start: calc(var(--icon-padding-subtract) * -1);
        }
      }
    }

    .text:empty {
      display: none;
    }
  }
</style>
