<!-- @canonical/generator-ds 0.10.0-experimental.2 -->
<script lang="ts">
  import type { DateTimeProps, RelativeTimeFormatValue } from "./types.js";
  import {
    dateTimeFormatter,
    relativeTimeFormatter,
  } from "./utils/formatters.js";
  import { getOptimalRelativeTimeFormatValue } from "./utils/getOptimalRelativeTimeFormatValue.js";

  let {
    date: dateProp,
    nowThreshold = 60_000,
    nowLabel = "now",
    absolute,
    ...rest
  }: DateTimeProps = $props();

  const date = $derived(new Date(dateProp));
  const formattedDate = $derived(dateTimeFormatter.format(date));
  // We intentionally capture only the initial value of `elapsed` and `rtfValue` here, and then update them in an effect below. If `time` changes, the effect will re-run and update them accordingly.
  // svelte-ignore state_referenced_locally
  let elapsed = $state(date.getTime() - Date.now());
  // svelte-ignore state_referenced_locally
  let rtfValue = $state<RelativeTimeFormatValue>(
    getOptimalRelativeTimeFormatValue(elapsed),
  );

  const display = $derived.by(() => {
    if (absolute) return formattedDate;
    if (Math.abs(elapsed) < nowThreshold) return nowLabel;
    return relativeTimeFormatter.format(rtfValue.value, rtfValue.unit);
  });

  $effect(() => {
    if (absolute) return;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const tick = () => {
      const newElapsed = date.getTime() - Date.now();
      const { nextUpdateIn, ...newRtfValue } =
        getOptimalRelativeTimeFormatValue(newElapsed);
      elapsed = newElapsed;
      rtfValue = newRtfValue;
      timeout = setTimeout(tick, nextUpdateIn);
    };

    tick();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  });
</script>

<time
  datetime={date.toISOString()}
  title={absolute ? undefined : formattedDate}
  {...rest}
>
  {display}
</time>

<!-- @component
`DateTime` component formats and displays dates and times in a user-friendly manner, automatically updating the display as time passes.

## Example Usage
```svelte
<DateTime date={new Date()} />
<DateTime date="2023-10-01T12:00:00Z" nowThreshold={0} nowLabel="just now" /> 
```
-->
