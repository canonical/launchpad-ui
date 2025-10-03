<script lang="ts" module>
  import type { TriggerProps } from "./types.js";

  export { children, trigger };
</script>

{#snippet trigger(triggerProps: TriggerProps)}
  <button {...triggerProps}>Tooltip trigger</button>
{/snippet}

{#snippet children()}
  <span>Tooltip content</span>
{/snippet}
