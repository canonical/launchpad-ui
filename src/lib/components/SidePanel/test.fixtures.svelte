<script lang="ts" module>
  import type { SidePanelTriggerProps } from "./types.js";

  const triggerText = "Open SidePanel";
  const contentText = "This is the side panel content.";
  const closeButtonText = "Close";

  export { children, closeButtonText, contentText, trigger, triggerText };
</script>

{#snippet trigger(triggerProps: SidePanelTriggerProps)}
  <button {...triggerProps}>{triggerText}</button>
{/snippet}

{#snippet children(popovertarget: string | undefined, close: () => void)}
  <div>
    <p>{contentText}</p>
    <button {popovertarget} onclick={close}>{closeButtonText}</button>
  </div>
{/snippet}
