<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { ItemContentProps } from "./types.js";

  let { icon, text, secondaryText, trailingText }: ItemContentProps = $props();
</script>

<span class="text">{text}</span>
{#if icon}
  <span class="icon">{@render icon()}</span>
{/if}
{#if secondaryText}
  <span class="secondary-text">{secondaryText}</span>
{/if}
{#if trailingText}
  <span class="trailing-text">{trailingText}</span>
{/if}

<style>
  .icon {
    grid-area: icon;
    display: inline-flex;
    align-items: center;
    margin-inline-end: var(--dimension-margin-end-item-icon);
  }

  .text {
    grid-area: text;
  }

  .secondary-text {
    grid-area: secondary-text;
    font: var(--typography-font-item-secondary);
    color: var(--color-text-item-secondary);
  }

  .trailing-text {
    grid-area: trailing-text;
    margin-inline-start: var(--dimension-margin-start-item-trailing-text);
  }
</style>
