<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { getLogContext } from "../../context.js";
  import type { LineProps } from "./types.js";
  import { formatTimestamp } from "./utils/formatTimestamp.js";

  const componentCssClassName = "ds log-line";

  let {
    class: className,
    line,
    timestamp,
    level,
    children,
    ...rest
  }: LineProps = $props();

  const logContext = getLogContext();

  const timestampDate = $derived(new Date(timestamp));

  const formattedTimestamp = $derived(
    formatTimestamp(timestampDate, logContext.timeZone),
  );
</script>

<tr class={[componentCssClassName, className]} {...rest}>
  <th class="line-number" scope="row">{line}</th>
  {#if !logContext.hideTimestamp}
    <td class="timestamp">
      <time datetime={timestampDate.toISOString()}>{formattedTimestamp}</time>
    </td>
  {/if}
  <td class={["content", `level-${level}`, { wrap: logContext.wrapLines }]}
    >{@render children()}</td
  >
</tr>

<style>
  .ds.log-line {
    vertical-align: top;
    display: contents;
    font: var(--tmp-typography-code-s);
    color: var(--tmp-color-text-default);

    td,
    th {
      font-weight: var(--tmp-typography-weight-regular);
    }

    .line-number {
      grid-column: line-number;
      text-align: right;
      color: var(--tmp-color-text-muted);
    }

    .timestamp {
      grid-column: timestamp;
      white-space: nowrap;

      padding-inline-start: var(--tmp-dimension-spacing-inline-s);
    }

    .content {
      grid-column: content;
      white-space: pre;

      padding-inline-start: var(--tmp-dimension-spacing-inline-m);

      &.wrap {
        white-space: pre-wrap;
        word-break: break-word;
      }
    }

    /* TODO: Implement level-based styling when designs ready */
  }
</style>
