<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { OptionContentProps } from "./types.js";

  let { icon, text, secondaryText, trailingText }: OptionContentProps =
    $props();
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
    margin-inline-end: var(--dimension-margin-end-option-icon);
  }

  .text {
    grid-area: text;
  }

  .secondary-text {
    grid-area: secondary-text;
    font: var(--typography-font-option-secondary);
    color: var(--color-text-option-secondary);
  }

  .trailing-text {
    grid-area: trailing-text;
    margin-inline-start: var(--dimension-margin-start-option-trailing-text);
  }
</style>
