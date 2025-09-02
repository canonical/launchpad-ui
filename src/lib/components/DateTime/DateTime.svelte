<!-- @canonical/generator-ds 0.10.0-experimental.2 -->
<script module lang="ts">
  // TODO: Remove hardcoded locale when i18n implemented
  const locale = "en-US";

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "long",
  });

  const dtf = new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short",
  });
</script>

<script lang="ts">
  import type { DateTimeProps, RtfValue } from "./types.js";
  import { getOptimalRtfValues } from "./utils.js";

  let {
    date: dateProp,
    nowThreshold = 60_000,
    nowLabel = "now",
    ...rest
  }: DateTimeProps = $props();

  const date = $derived(new Date(dateProp));
  const time = $derived(date.getTime());
  // svelte-ignore state_referenced_locally
  let elapsed = $state(time - Date.now());
  // svelte-ignore state_referenced_locally
  let rtfValue = $state<RtfValue>(getOptimalRtfValues(elapsed));

  const display = $derived(
    Math.abs(elapsed) < nowThreshold
      ? nowLabel
      : rtf.format(rtfValue.value, rtfValue.unit),
  );

  $effect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const newElapsed = time - Date.now();
      const { nextUpdateIn, ...newRefValue } = getOptimalRtfValues(newElapsed);
      elapsed = newElapsed;
      rtfValue = newRefValue;
      timeout = setTimeout(tick, nextUpdateIn);
    };

    tick();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  });
</script>

<!-- 
  TODO: Is title attribute an accessible way to do it here?
  - https://www.24a11y.com/2017/the-trials-and-tribulations-of-the-title-attribute/
  - https://inclusive-components.design/tooltips-toggletips/
  - https://www.tpgi.com/using-the-html-title-attribute-updated/
 -->
<time datetime={date.toISOString()} title={dtf.format(date)} {...rest}>
  {display}
</time>

<!-- @component
`DateTime` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<DateTime class="custom-class" id="unique-id">
  <p>Content goes here</p>
</DateTime>
```
-->
