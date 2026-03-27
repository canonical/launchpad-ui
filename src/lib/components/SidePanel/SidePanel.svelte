<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { isEventTargetInElement } from "$lib/utils/index.js";
  import type { SidePanelMethods, SidePanelProps } from "./types.js";

  const componentCssClassName = "ds side-panel";

  let {
    id: idProp,
    class: className,
    trigger,
    children,
    closeOnOutsideClick = true,
    onclick,
    ...rest
  }: SidePanelProps = $props();

  let dialogRef = $state<HTMLDialogElement>();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isMounted = useIsMounted();

  export const showModal: SidePanelMethods["showModal"] = () => {
    dialogRef?.showModal();
  };

  export const close: SidePanelMethods["close"] = () => {
    dialogRef?.close();
  };

  // Webkit doesn't support `closedby` attribute on dialog elements (https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/closedBy).
  // TODO(closedby): Remove this fallback when Webkit supports it.
  let contentWrapperRef = $state<HTMLElement>();

  const isClosedByFallbackNeeded = $derived(
    isMounted.value && !("closedBy" in HTMLDialogElement.prototype),
  );

  const isInvokerCommandsFallbackNeeded = $derived(
    isMounted.value &&
      (!("commandForElement" in HTMLButtonElement.prototype) ||
        !("command" in HTMLButtonElement.prototype)),
  );

  const fallbackOnclick: typeof onclick = (e) => {
    onclick?.(e);
    if (
      closeOnOutsideClick &&
      contentWrapperRef &&
      !isEventTargetInElement(e.target, contentWrapperRef)
    ) {
      close();
    }
  };
</script>

{@render trigger?.({
  onclick: isInvokerCommandsFallbackNeeded ? showModal : undefined,
  commandfor: id,
  command: "show-modal",
  "aria-haspopup": "dialog",
})}

<dialog
  bind:this={dialogRef}
  {id}
  class={[componentCssClassName, className]}
  closedby={closeOnOutsideClick ? "any" : "closerequest"}
  data-testid="side-panel"
  onclick={isClosedByFallbackNeeded ? fallbackOnclick : onclick}
  {...rest}
>
  <!-- TODO(closedby): Remove this wrapper when Webkit supports closedby -->
  <div style="display: contents;" bind:this={contentWrapperRef}>
    {@render children?.(id, close)}
  </div>
</dialog>

<!-- @component
`SidePanel` provides a mechanism for displaying content overlaying the main application. It is a bring-your-own trigger and content component.

SidePanel can be imperatively controlled by the following methods available on the component instance:
- `showModal`: Shows the modal.
- `close`: Closes the modal.

SidePanel is declaratively controlled by default through the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) using `commandfor` and `command` attributes supplied via the `trigger` snippet. Imperative methods remain available for cases where opening or closing must be orchestrated in code. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) for more information.

## Example Usage
```svelte
<script lang="ts">
  let sidePanel = $state<SidePanelMethods>();
  // Imperative controls on the component instance
  $effect(() => sidePanel?.showModal())
</script>

<SidePanel bind:this={sidePanel}>
  {#snippet trigger(triggerProps)}
    <button {...triggerProps}>
      Open SidePanel
    </button>
  {/snippet}
  {#snippet children(commandfor, close)}
    <ModalContent.Header>
      SidePanel's Header
      <ModalContent.Header.CloseButton
        {commandfor}
        command="close"
      />
    </ModalContent.Header>
    <ModalContent.Body>
      Main Content
    </ModalContent.Body>
    <ModalContent.Footer>
      <Button
        onclick={() => {
          // doSomething();
          close();
        }}
      >
        Confirm
      </Button>
    </ModalContent.Footer>
  {/snippet}
</SidePanel>
```

-->

<style>
  .ds.side-panel {
    --color-background-side-panel-backdrop: var(--lp-color-background-overlay);
    /* TODO(@Enzo): Replace with a token */
    --dimension-width-side-panel: 33.5rem;

    position: fixed;
    margin-inline-start: auto;
    border: none;

    width: min(100vw, var(--dimension-width-side-panel));
    height: 100vh;
    max-height: 100vh;

    box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.2);
    transform: translateX(100%);
    transition-behavior: allow-discrete;
    transition-property: display, transform, overlay;
    transition-duration: var(--lp-transition-duration-fast);

    /* 
      [open] is a fallback for Safari that doesn't support the `:open`.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    &:is(:open, [open]) {
      transform: translateX(0);
    }

    &::backdrop {
      background-color: transparent;
    }

    :global(> .ds.modal-content) {
      --border-modal-content: none;
    }
  }

  @starting-style {
    /* 
      [open] is a fallback for Safari that doesn't support the `:open`.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    .ds.side-panel:is(:open, [open]) {
      transform: translateX(100%);
    }
  }
</style>
