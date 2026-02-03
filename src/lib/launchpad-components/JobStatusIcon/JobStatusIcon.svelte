<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ErrorIcon, HelpIcon, SuccessIcon } from "@canonical/svelte-icons";
  import type { Component } from "svelte";
  import { LoadingStepsIcon, SkipIcon } from "$lib/components/icons/index.js";
  import { Spinner } from "$lib/components/index.js";
  import { safeAssertUnreachable } from "$lib/utils/index.js";
  import type { JobStatusIconProps } from "./types.js";

  let { status, role = "img", ...rest }: JobStatusIconProps = $props();

  const [Icon, colorCssVar] = $derived.by((): [Component, `--${string}`] => {
    switch (status) {
      case "FINISHED":
        return [SuccessIcon, "--lp-color-icon-positive"];
      case "FAILED":
      case "TERMINATED":
        return [ErrorIcon, "--lp-color-icon-negative"];
      case "EXECUTING":
        return [Spinner, "--lp-color-icon-default"];
      case "IDLE":
      case "PENDING":
        return [LoadingStepsIcon, "--lp-color-icon-default"];
      case "CANCELLED":
        return [SkipIcon, "--lp-color-icon-muted"];
      case null:
        return [HelpIcon, "--lp-color-icon-default"];
      default:
        safeAssertUnreachable(status, `Unhandled job status: ${status}`);
        return [HelpIcon, "--lp-color-icon-default"];
    }
  });
</script>

<Icon
  {role}
  aria-label="Status: {status ?? 'Unknown'}"
  style="color: var(--job-status-icon-color, var({colorCssVar}));"
  {...rest}
/>

<!-- @component
`JobStatusIcon` is an icon component that represents the status of a job.

To override the default colors, you can set the CSS variable `--job-status-icon-color`.

## Example Usage
```svelte
<JobStatusIcon status="FINISHED" />
<JobStatusIcon status="FAILED" />
<JobStatusIcon status="EXECUTING" --job-status-icon-color="orange" />
```
-->
