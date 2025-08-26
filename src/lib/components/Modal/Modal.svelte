<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Button, Icon } from "$lib/components/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import type { ModalMethods, ModalProps } from "./types.js";

  const componentCssClassName = "ds modal";

  let {
    id: idProp,
    class: className,
    trigger,
    header,
    children,
    footer,
    closeOnOutsideClick = true,
    withCloseButton = true,
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

{@render trigger?.(asPopover ? id : undefined, showModal)}

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
  data-testid="modal"
  {...rest}
>
  <section>
    {#if header || withCloseButton}
      <header>
        {@render header?.()}
        {#if withCloseButton}
          <Button
            modifiers={["base"]}
            class="close"
            popovertarget={asPopover ? id : undefined}
            popovertargetaction={asPopover ? "hide" : undefined}
            onclick={close}
            aria-label="Close"
          >
            {#snippet iconLeft()}
              <Icon name="close" />
            {/snippet}
          </Button>
        {/if}
      </header>
    {/if}
    {#if children}
      <div>
        {@render children()}
      </div>
    {/if}
    {#if footer}
      <footer>
        {@render footer(asPopover ? id : undefined, close)}
      </footer>
    {/if}
  </section>
</dialog>

<!-- @component
`Modal` presents blocking dialog content.

Modal can be imperatively controlled by the following methods available on the component instance:
- `showModal`: Additionally supplied via the `trigger` snippet.
- `close`: Additionally supplied via the `footer` snippet.

If JavaScript is disabled, Modal can be controlled as a popover with declaratively bound button triggers. To allow for that pass the `popovertarget` supplied via the `trigger` or `footer` snippets to buttons you want to use as triggers. However this should be treated as a fallback. If possible, the modal should be controlled using the imperative calls of `showModal` and `close` which ensure better accessibility and user experience (e.g. rendering the rest of the document as inert) See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) for more information.

## Example Usage
```svelte
<script lang="ts">
  let modal = $state<ModalMethods>();
  // Imperative controls on the component instance
  $effect(() => modal?.showModal())
</script>

<Modal bind:this={modal}>
  {#snippet trigger(popovertarget, open)}
    <button {popovertarget} onclick={open}>
      Open Modal
    </button>
  {/snippet}
  This is content of the modal.
  {#snippet footer(popovertarget, close)}
    <button {popovertarget} onclick={close}>Cancel</button>
    <button
      {popovertarget}
      onclick={() => {
        // doSomething();
        close();
      }}
    >
      Confirm
    </button>
  {/snippet}
</Modal>
```

-->

<style>
  .ds.modal {
    --border-modal: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-high-contrast);
    --color-background-modal-backdrop: var(--tmp-color-background-overlay);
    --color-background-modal: var(--tmp-color-background-default);
    --color-text-modal: var(--tmp-color-text-default);
    --dimension-gap-modal-footer: var(--tmp-dimension-spacing-inline-m);
    --dimension-gap-modal: var(--tmp-dimension-spacing-block-m);
    --dimension-padding-block-modal: var(--tmp-dimension-spacing-block-l);
    --dimension-padding-inline-modal: var(--tmp-dimension-spacing-inline-l);
    /* TODO(@Enzo): Replace with a token */
    --dimension-width-modal: 38rem;
    --typography-modal-header: var(--tmp-typography-h4);
    --typography-modal: var(--tmp-typography-paragraph-default);

    position: fixed;
    margin: auto;

    background-color: var(--color-background-modal);
    border: var(--border-modal);
    width: min(100vw, var(--dimension-width-modal));
    color: var(--color-text-modal);
    font: var(--typography-modal);

    opacity: 0;
    transition-behavior: allow-discrete;
    transition-property: display, opacity, overlay;
    transition-duration: var(--tmp-transition-duration-fast);

    &::backdrop {
      opacity: inherit;
      transition: inherit;

      background-color: var(--color-background-modal-backdrop);
    }

    &:open,
    &:popover-open {
      opacity: 1;
    }

    > section {
      padding-block: var(--dimension-padding-block-modal);
      padding-inline: var(--dimension-padding-inline-modal);

      > header {
        font: var(--typography-modal-header);

        display: flex;
        justify-content: space-between;
        align-items: baseline;
        text-wrap: balance;

        > :global(button.close) {
          margin-inline-start: auto;
        }
      }

      > footer {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--dimension-gap-modal-footer);
      }

      > *:not(:first-child) {
        margin-top: var(--dimension-gap-modal);
      }
    }
  }

  @starting-style {
    .ds.modal {
      &:open,
      &:popover-open {
        opacity: 0;
      }
    }
  }
</style>
