<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Modal } from "$lib/components/Modal/index.js";
  import type { ModalMethods } from "$lib/components/Modal/index.js";
  import { ModalContent } from "$lib/components/ModalContent/index.js";
  import { useShortcuts } from "$lib/shortcuts/index.js";
  import type {
    ShortcutsHelpModalMethods,
    ShortcutsHelpModalProps,
  } from "./types.js";

  const props: ShortcutsHelpModalProps = $props();
  let modalMethods = $state<ModalMethods>();

  export const showModal: ShortcutsHelpModalMethods["showModal"] = () => {
    modalMethods?.showModal();
  };

  export const close: ShortcutsHelpModalMethods["close"] = () => {
    modalMethods?.close();
  };

  const shortcuts = useShortcuts();
</script>

<Modal bind:this={modalMethods} {...props}>
  {#snippet children(_, close)}
    <ModalContent>
      <ModalContent.Header>
        Shortcuts Help
        <ModalContent.Header.CloseButton onclick={close} />
      </ModalContent.Header>
      <ModalContent.Body>
        <dl>
          {#each shortcuts().filter((shortcut) => shortcut.enabled) as shortcut (shortcut)}
            <dt>{shortcut.label}</dt>
            <dd>{shortcut.toHumanReadable()}</dd>
          {/each}
        </dl>
      </ModalContent.Body>
    </ModalContent>
  {/snippet}
</Modal>

<!-- @component
 `ShortcutsHelpModal` is a modal dialog that displays a list of enabled keyboard shortcuts registered in the nearest `ShortcutsProvider`.

  ## Example Usage
  ```svelte
  <ShortcutsProvider>
    <UseShortcuts shortcuts={new Shortcut("ctrl+/", "Show Shortcuts Help", () => {
      modalMethods?.showModal();
    })} />
    <ShortcutsHelpModal bind:this={modalMethods} />
    <YourAppComponents />
  </ShortcutsProvider>
  ```
-->

<style>
  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    dt {
      text-align: left;
    }
    dd {
      text-align: right;
      font-family: var(--typography-font-monospace);
    }
  }
</style>
