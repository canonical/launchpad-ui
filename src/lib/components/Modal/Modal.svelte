<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { isEventTargetInElement } from "$lib/utils/index.js";
  import type { ModalMethods, ModalProps } from "./types.js";

  const componentCssClassName = "ds modal";

  let {
    id: idProp,
    class: className,
    trigger,
    children,
    closeOnOutsideClick = true,
    onclick,
    ...rest
  }: ModalProps = $props();

  let dialogRef = $state<HTMLDialogElement>();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isMounted = useIsMounted();

  export const showModal: ModalMethods["showModal"] = () => {
    dialogRef?.showModal();
  };

  export const close: ModalMethods["close"] = () => {
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
  onclick={isClosedByFallbackNeeded ? fallbackOnclick : onclick}
  {...rest}
>
  <!-- TODO(closedby): Remove this wrapper when Webkit supports closedby -->
  <div style="display: contents;" bind:this={contentWrapperRef}>
    {@render children?.(id, close)}
  </div>
</dialog>

<!-- @component
`Modal` provides a mechanism for displaying content overlaying the main application. It is a bring-your-own trigger and content component.

The modal-like layout and structure are provided by the `ModalContent` component.

Modal can be imperatively controlled by the following methods available on the component instance:
- `showModal`: Shows the modal.
- `close`: Closes the modal.

Modal is declaratively controlled by default through the [Invoker Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API) using `commandfor` and `command` attributes supplied via the `trigger` snippet. Imperative methods remain available for cases where opening or closing must be orchestrated in code. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) for more information.

## Example Usage
```svelte
<script lang="ts">
  let modal = $state<ModalMethods>();
  // Imperative controls on the component instance
  $effect(() => modal?.showModal())
</script>

<Modal bind:this={modal}>
  {#snippet trigger(triggerProps)}
    <button {...triggerProps}>
      Open Modal
    </button>
  {/snippet}
  {#snippet children(commandfor, close)}
    <ModalContent.Header>
      Modal's Header
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
</Modal>
```

-->

<style>
  .ds.modal {
    --color-background-modal-backdrop: var(--lp-color-background-overlay);
    /* TODO(@Enzo): Replace with a token */
    --dimension-width-modal: 38rem;

    position: fixed;
    margin: auto;
    border: none;

    width: min(100vw, var(--dimension-width-modal));

    &::backdrop {
      background-color: var(--color-background-modal-backdrop);
    }

    /* 
      [open] is a fallback for Safari that doesn't support the `:open`.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    &:is(:open, [open]) {
      &,
      &::backdrop {
        opacity: 1;
      }
    }
  }

  .ds.modal,
  .ds.modal::backdrop {
    opacity: 0;
    transition-behavior: allow-discrete;
    transition-property: display, opacity, overlay;
    transition-duration: var(--lp-transition-duration-fast);
  }

  @starting-style {
    /* 
      [open] is a fallback for Safari that doesn't support the `:open`.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    .ds.modal:is(:open, [open]) {
      &,
      &::backdrop {
        opacity: 0;
      }
    }
  }
</style>
