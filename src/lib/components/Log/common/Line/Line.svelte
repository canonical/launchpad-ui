<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { getLogContext } from "../../context.js";
  import type { LineProps } from "./types.js";
  import { formatTimeStamp } from "./utils/formatTimeStamp.js";

  const componentCssClassName = "ds line";

  let {
    class: className,
    line,
    timestamp,
    level,
    message,
    ...rest
  }: LineProps = $props();

  const logContext = getLogContext();

  const formattedTimestamp = $derived(
    formatTimeStamp(new Date(timestamp), logContext?.timeZone),
  );
</script>

<tr class={[componentCssClassName, className]} {...rest}>
  <th class="line-number" scope="row">{line}</th>
  <td class="timestamp">{formattedTimestamp}</td>
  <td class={`content level-${level}`}>{message}</td>
</tr>

<!-- @component
`Line` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Line class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Line>
```
-->

<style>
  .ds.line {
    --font-log-line: var(--tmp-typography-code-s);
    --color-text-log-line: var(--tmp-color-text-default);
    --color-text-log-line-line-number: var(--tmp-color-text-muted);
    --typography--font-weight-log-line: var(--tmp-typography-weight-regular);
    --dimension-padding-inline-start-log-line-content: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-inline-start-log-line-timestamp: var(
      --tmp-dimension-spacing-inline-s
    );
    --dimension-padding-inline-end-log-line-collapse: var(
      --tmp-dimension-spacing-inline-m
    );

    vertical-align: top;

    font: var(--font-log-line);
    color: var(--color-text-log-line);

    td,
    th {
      font-weight: var(--typography--font-weight-log-line);
    }

    .line-number {
      grid-column: line-number;
      text-align: right;
      color: var(--color-text-log-line-line-number);
    }

    .timestamp {
      grid-column: timestamp;
      white-space: nowrap;

      padding-inline-start: var(
        --dimension-padding-inline-start-log-line-timestamp,
      );
    }

    .content {
      grid-column: content;
      white-space: pre;

      padding-inline-start: var(
        --dimension-padding-inline-start-log-line-content,
      );
    }
  }
</style>
