<script lang="ts" generics="TFilters extends object">
  import type { GroupProps } from "./types.js";

  let { parts }: GroupProps<TFilters> = $props();
</script>

{#each parts as part, index (part.key)}
  <li class:last-part-in-group={index === parts.length - 1}>
    {#if part.label}<span>{part.label}:</span>{/if}
    {part.text}
  </li>
{/each}

<style>
  li {
    &:not(.last-part-in-group)::after {
      content: ", ";
      white-space: pre;
    }

    &.last-part-in-group {
      &:not(:last-child) {
        border-inline-end: var(--filter-summary-separator);
        padding-inline-end: var(--dimension-150);
      }

      + li {
        padding-inline-start: var(--dimension-150);
      }
    }

    span {
      color: var(--color-text-muted);
    }
  }
</style>
