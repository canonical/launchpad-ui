<script lang="ts" module>
  import type { ModalTriggerProps } from "./types.js";

  const triggerText = "Open Modal";
  const contentText = "This is the modal content.";
  const closeButtonText = "Close";

  export { children, closeButtonText, contentText, trigger, triggerText };
</script>

{#snippet trigger(triggerProps: ModalTriggerProps)}
  <button {...triggerProps}>{triggerText}</button>
{/snippet}

{#snippet children(popovertarget: string | undefined, close: () => void)}
  <div>
    <p>{contentText}</p>
    <button {popovertarget} onclick={close}>{closeButtonText}</button>
  </div>
{/snippet}
