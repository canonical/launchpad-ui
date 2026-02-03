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
  const asPopover = $derived(!isMounted.value);

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
  data-testid="side-panel"
  onclick={isClosedByFallbackNeeded ? fallbackOnclick : onclick}
  {...rest}
>
  <!-- TODO(closedby): Remove this wrapper when Webkit supports closedby -->
  <div style="display: contents;" bind:this={contentWrapperRef}>
    {@render children?.(asPopover ? id : undefined, close)}
  </div>
</dialog>

<!-- @component
`SidePanel` provides a mechanism for displaying content overlaying the main application. It is a bring-your-own trigger and content component.

SidePanel can be imperatively controlled by the following methods available on the component instance:
- `showModal`: Additionally supplied as `triggerProps.onclick` via the `trigger` snippet.
- `close`: Additionally supplied via the `children` snippet.

If JavaScript is disabled, SidePanel can be controlled as a popover with declaratively bound button triggers. To allow for that pass the `popovertarget` supplied via the `trigger` or `children` snippets to buttons you want to use as triggers. However this should be treated as a fallback. If possible, the side panel should be controlled using the imperative calls of `showModal` and `close` which ensure better accessibility and user experience (e.g. rendering the rest of the document as inert) See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) for more information.

## Example Usage
```svelte
<script lang="ts">
  let sidePanel = $state<SidePanelMethods>();
  // Imperative controls on the component instance
  $effect(() => sidePanel?.show())
</script>

<SidePanel bind:this={sidePanel}>
  {#snippet trigger(triggerProps)}
    <button {...triggerProps}>
      Open SidePanel
    </button>
  {/snippet}
  {#snippet children(popovertarget, close)}
    <ModalContent.Header>
      SidePanel's Header
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

    &:open {
      transform: translateX(0);
    }

    /* 
      Fallback for Safari that doesn't support the `:open`. It has to be kept separate from the above `&:open` to work.

      TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
    */
    &[open],
    &:popover-open {
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
    .ds.side-panel {
      &:open {
        transform: translateX(100%);
      }

      /* 
        Fallback for Safari that doesn't support the `:open`. It has to be kept separate from the above `&:open` to work.

        TODO(:open): Remove when Safari supports it (https://developer.mozilla.org/en-US/docs/Web/CSS/:open)
      */
      &[open],
      &:popover-open {
        transform: translateX(100%);
      }
    }
  }
</style>
