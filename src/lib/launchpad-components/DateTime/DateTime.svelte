<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { DateTime } from "$lib/components/index.js";
  import type { DateTimeProps } from "./types.js";

  const props: DateTimeProps = $props();

  function pad(num: number): string {
    return String(num).padStart(2, "0");
  }

  function format(date: Date) {
    const YYYY = date.getUTCFullYear();
    const MM = pad(date.getUTCMonth() + 1);
    const DD = pad(date.getUTCDate());
    const HH = pad(date.getUTCHours());
    const mm = pad(date.getUTCMinutes());
    const ss = pad(date.getUTCSeconds());

    return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss} UTC`;
  }
</script>

<DateTime formatter={{ format }} {...props} />

<!-- @component
`DateTime` is a wrapper around the base `DateTime` providing a formatter that outputs dates in the `YYYY-MM-DD HH:mm:ss UTC` format.

## Example Usage
```svelte
<DateTime date={new Date()} />
```
-->
