<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import type { ModalMethods, ModalProps } from "./types.js";

  const componentCssClassName = "ds modal";

  let {
    id: idProp,
    class: className,
    trigger,
    children,
    closeOnOutsideClick = true,
    ...rest
  }: ModalProps = $props();

  let dialogRef = $state<HTMLDialogElement>();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isMounted = useIsMounted();
  const asPopover = $derived(!isMounted.value);

  export const showModal: ModalMethods["showModal"] = () => {
    dialogRef?.showModal();
  };

  export const close: ModalMethods["close"] = () => {
    dialogRef?.close();
  };
</script>

{@render trigger?.({
  onclick: showModal,
  "aria-haspopup": "dialog",
  popovertarget: asPopover ? id : undefined,
})}

<dialog
  bind:this={dialogRef}
  {id}
  class={[componentCssClassName, className]}
  popover={asPopover ? (closeOnOutsideClick ? "auto" : "manual") : undefined}
  closedby={asPopover
    ? undefined
    : closeOnOutsideClick
      ? "any"
      : "closerequest"}
  {...rest}
>
  {@render children?.(asPopover ? id : undefined, close)}
</dialog>

<!-- @component
`Modal` provides a mechanism for displaying content overlaying the main application. It is a bring-your-own trigger and content component.

The modal-like layout and structure are provided by the `ModalContent` component.

Modal can be imperatively controlled by the following methods available on the component instance:
- `showModal`: Additionally supplied as `triggerProps.onclick` via the `trigger` snippet.
- `close`: Additionally supplied via the `children` snippet.

If JavaScript is disabled, Modal can be controlled as a popover with declaratively bound button triggers. To allow for that pass the `popovertarget` supplied via the `trigger` or `children` snippets to buttons you want to use as triggers. However this should be treated as a fallback. If possible, the modal should be controlled using the imperative calls of `showModal` and `close` which ensure better accessibility and user experience (e.g. rendering the rest of the document as inert) See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) for more information.

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
  {#snippet children(popovertarget, close)}
    <ModalContent.Header>
      Modal's Header
      <ModalContent.Header.CloseButton
        {popovertarget}
        onclick={close}
      />
    </ModalContent.Header>
    <ModalContent.Body>
      Main Content
    </ModalContent.Body>
    <ModalContent.Footer>
      <Button
        {popovertarget}
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
    --color-background-modal-backdrop: var(--tmp-color-background-overlay);
    /* TODO(@Enzo): Replace with a token */
    --dimension-width-modal: 38rem;

    position: fixed;
    margin: auto;
    border: none;

    width: min(100vw, var(--dimension-width-modal));

    &::backdrop {
      background-color: var(--color-background-modal-backdrop);
    }

    &:open {
      &,
      &::backdrop {
        opacity: 1;
      }
    }

    /* 
      Fallback for Safari that doesn't support the `:open`. It has to be kept separate from the above `&:open` to work.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    &[open],
    &:popover-open {
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
    transition-duration: var(--tmp-transition-duration-fast);
  }

  @starting-style {
    .ds.modal {
      &:open {
        &,
        &::backdrop {
          opacity: 0;
        }
      }

      /* 
        Fallback for Safari that doesn't support the `:open`. It has to be kept separate from the above `&:open` to work.

        TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
      */
      &[open],
      &:popover-open {
        &,
        &::backdrop {
          opacity: 0;
        }
      }
    }
  }
</style>
