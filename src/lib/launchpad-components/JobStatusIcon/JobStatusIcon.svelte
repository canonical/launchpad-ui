<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ErrorIcon, HelpIcon, SuccessIcon } from "@canonical/svelte-icons";
  import { LoadingStepsIcon, SkipIcon } from "$lib/components/icons/index.js";
  import { Spinner } from "$lib/components/index.js";
  import { safeAssertNever } from "$lib/utils/index.js";
  import type { JobStatusIconProps } from "./types.js";

  let { status }: JobStatusIconProps = $props();
</script>

{#if status === "FINISHED"}
  <SuccessIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-positive))"
  />
{:else if status === "FAILED"}
  <ErrorIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-negative))"
  />
{:else if status === "EXECUTING"}
  <Spinner
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-default))"
  />
{:else if status === "IDLE" || status === "PENDING"}
  <LoadingStepsIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-default))"
  />
{:else if status === "CANCELLED"}
  <SkipIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-muted))"
  />
{:else if status === null}
  <HelpIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-default))"
  />
{:else}
  <!-- Make TS unhappy with unhandled job statuses, while displaying a fallback icon -->
  <HelpIcon
    style="color: var(--job-status-icon-color, var(--tmp-color-icon-default))"
  />
  {safeAssertNever(status, `Unhandled job status: ${status}`)}
{/if}

<!-- @component
`JobStatusIcon` represents the status of a job using an icon.
To override the default colors, you can set the CSS variable `--job-status-icon-color`.

## Example Usage
```svelte
<JobStatusIcon status="FINISHED" />
<JobStatusIcon status="FAILED" />
<JobStatusIcon status="EXECUTING" --job-status-icon-color="orange" />
```
-->
