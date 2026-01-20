<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { setLogContext } from "./context.js";
  import type { LogProps } from "./types.js";

  const componentCssClassName = "ds log";

  let {
    class: className,
    children,
    hideTimestamp = false,
    wrapLines = false,
    timeZone = "UTC",
    caption,
    ...rest
  }: LogProps = $props();

  setLogContext({
    get timeZone() {
      return timeZone;
    },
    get hideTimestamp() {
      return hideTimestamp;
    },
    get wrapLines() {
      return wrapLines;
    },
  });
</script>

<table class={[componentCssClassName, className]} {...rest}>
  {#if caption}
    <caption class="visually-hidden">{caption}</caption>
  {/if}

  <thead class="visually-hidden">
    <tr>
      <th scope="col" class="line-number">Line</th>
      {#if !hideTimestamp}
        <th scope="col" class="timestamp">Timestamp</th>
      {/if}
      <th scope="col" class="content">Content</th>
    </tr>
  </thead>

  <tbody>
    {@render children?.()}
  </tbody>
</table>

<!-- @component
`Log` is used to display log entries in a structured table format.

## Example Usage
```svelte
<Log>
  <Log.Line
    line={1}
    timestamp="2024-10-27T10:00:59.400Z"
    level="info"
    message="Application started successfully."
  />
  <Log.Line
    line={2}
    timestamp="2024-10-27T10:05:12.300Z"
    level="error"
    message="Failed to connect to database."
  />
</Log>
```
-->

<style>
  .ds.log {
    display: block;
    contain: inline-size layout paint;
    overflow: auto;

    --log-padding-inline: var(--tmp-dimension-spacing-inline-m);

    background-color: var(--tmp-color-background-alt);
    padding-inline-end: var(--log-padding-inline);
    padding-block-end: var(--tmp-dimension-spacing-block-xxxl);

    tbody {
      display: grid;
      min-width: fit-content;
      grid-template-columns: [line-number-start] auto [line-number-end timestamp-start] max-content [timestamp-end content-start] 1fr [content-end];
      row-gap: var(--tmp-dimension-spacing-block-xxxs);
    }
  }
</style>
