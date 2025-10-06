<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { onMount } from "svelte";
  import type { ModalMethods } from "$lib/components/index.js";
  import { Modal, ModalContent } from "$lib/components/index.js";
  import { Shortcut } from "$lib/shortcut/index.js";
  import { getMarkdownEditorContext } from "../../context.js";
  import type { HelpModalProps } from "./types.js";

  let props: HelpModalProps = $props();
  const markdownEditorContext = getMarkdownEditorContext();
  let shortcutsHelpModal = $state<ModalMethods>();
  const helpShortcut = new Shortcut("ctrl+/", "Show Shortcuts Help", () => {
    shortcutsHelpModal?.showModal();
  });

  onMount(() => {
    if (!markdownEditorContext) return;
    markdownEditorContext.shortcuts = [
      helpShortcut,
      ...markdownEditorContext.shortcuts,
    ];

    return () => {
      markdownEditorContext.shortcuts = markdownEditorContext.shortcuts.filter(
        (s) => s !== helpShortcut,
      );
    };
  });
</script>

<Modal bind:this={shortcutsHelpModal} {...props}>
  {#snippet children(_, close)}
    <ModalContent>
      <ModalContent.Header>
        Shortcuts Help
        <ModalContent.Header.CloseButton onclick={close} />
      </ModalContent.Header>
      <ModalContent.Body>
        <!-- TODO: consider this as a general component -->
        <dl>
          {#each Object.values(markdownEditorContext?.shortcuts || []) as shortcut (shortcut.shortcut)}
            <dt>{shortcut.label}</dt>
            <dd>{shortcut.toHumanReadable()}</dd>
          {/each}
        </dl>
      </ModalContent.Body>
    </ModalContent>
  {/snippet}
</Modal>

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
