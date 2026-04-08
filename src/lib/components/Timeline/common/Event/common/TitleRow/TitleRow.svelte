<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import "./styles.css";
  import type { TitleRowProps } from "./types.js";

  const componentCssClassName = "ds timeline-title-row";

  let {
    class: className,
    children,
    leadingText,
    date,
    ...rest
  }: TitleRowProps = $props();
</script>

<div
  class={[componentCssClassName, className]}
  data-testid="title-row"
  {...rest}
>
  <span class="content">
    {#if leadingText}
      <span class="leading-text">{leadingText}</span>
    {/if}
    <span class="description">
      {@render children()}
    </span>
  </span>
  <span class="date">{@render date()}</span>
</div>

<!-- @component
`Timeline.Event.TitleRow` is used to display a title row within a timeline event.

## Example Usage
```svelte
<Timeline.Event.TitleRow leadingText="Alvarez Daniella">
  added labels: Don't merge, Maintenance, Review: QA needed
  {#snippet date()}
    <DateTime date="2023-03-15" />
  {/snippet}
</Timeline.Event.TitleRow>
```
-->
