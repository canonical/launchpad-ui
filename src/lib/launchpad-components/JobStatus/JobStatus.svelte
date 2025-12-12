<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ErrorIcon, HelpIcon, SuccessIcon } from "@canonical/svelte-icons";
  import type { Component } from "svelte";
  import { LoadingStepsIcon, SkipIcon } from "$lib/components/icons/index.js";
  import { IconText, Spinner } from "$lib/components/index.js";
  import type { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
  import type { JobStatusProps } from "./types.js";

  let { status, ...rest }: JobStatusProps = $props();

  const statusMap: Record<
    typeof status,
    {
      modifier: (typeof SEMANTIC_MODIFIERS.lifecycle)[number] | null;
      icon: Component;
    }
  > = {
    PENDING: { modifier: null, icon: LoadingStepsIcon },
    IDLE: { modifier: null, icon: LoadingStepsIcon },
    EXECUTING: { modifier: null, icon: Spinner },
    FINISHED: { modifier: "completed", icon: SuccessIcon },
    FAILED: { modifier: "failed", icon: ErrorIcon },
    CANCELLED: { modifier: "suspended", icon: SkipIcon },
  };

  const { Icon, modifier, label } = $derived.by(() => {
    const { modifier, icon: Icon } = statusMap[status] || {
      modifier: null,
      icon: HelpIcon,
    };

    return {
      Icon,
      modifier,
      label: status.charAt(0) + status.slice(1).toLowerCase(),
    };
  });
</script>

<IconText modifiers={{ lifecycle: modifier }} {...rest}>
  {#snippet icon()}
    <Icon />
  {/snippet}
  {label}
</IconText>
