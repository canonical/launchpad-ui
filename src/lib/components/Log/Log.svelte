<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setLogContext } from "./context.js";
  import type { LogProps } from "./types.js";

  const componentCssClassName = "ds log";

  let {
    class: className,
    children,
    hideTimestamp,
    timeZone = "UTC",
    caption,
    ...rest
  }: LogProps = $props();

  setLogContext({
    get timeZone() {
      return timeZone;
    },
  });
</script>

<table
  class={[componentCssClassName, className]}
  class:hide-timestamp={hideTimestamp}
  {...rest}
>
  {#if caption}
    <caption class="visually-hidden">{caption}</caption>
  {/if}

  <thead class="visually-hidden">
    <tr>
      <th scope="col" class="line-number">Line</th>
      <th scope="col" class="timestamp">Timestamp</th>
      <th scope="col" class="content">Content</th>
    </tr>
  </thead>

  <tbody>
    {@render children?.()}
  </tbody>
</table>

<!-- @component
`Log` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Log class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Log>
```
-->

<style>
  .ds.log {
    --color-background-log: var(--tmp-color-background-alt);
    --dimension-padding-inline-log: var(--tmp-dimension-spacing-inline-m);
    --dimension-row-gap-log: var(--tmp-dimension-spacing-block-xxxs);

    display: block;
    container: table / inline-size;

    background-color: var(--color-background-log);
    padding-inline: var(--dimension-padding-inline-log);
    padding-block: var(--dimension-row-gap-log);

    tbody {
      display: grid;
      overflow-x: auto;
      grid-template-columns:
        [collapse-start] auto [collapse-end line-number-start] auto [line-number-end timestamp-start] max-content [timestamp-end content-start] minmax(
          0,
          1fr
        )
        [content-end];
      row-gap: var(--dimension-row-gap-log);

      :global(tr) {
        display: contents;
      }
    }

    :global(.timestamp) {
      display: none;
    }

    &:not(.hide-timestamp) {
      @container table (width > 620px) {
        :global(.timestamp) {
          display: table-cell;
        }
      }
    }

    /* &.hide-timestamp {
      tbody {
        grid-template-columns: auto 1fr;
      }

      :global(.timestamp) {
        display: none;
      }
    }

    @container table (width <= 620px) {
      tbody {
        grid-template-columns: auto 1fr;
      }

      :global(.timestamp) {
        display: none;
      }
    } */
  }
</style>
