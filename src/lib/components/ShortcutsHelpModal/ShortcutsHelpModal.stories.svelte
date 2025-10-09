<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import GlobalShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/GlobalShortcutsProvider.svelte";
  import ShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/ShortcutsProvider.svelte";
  import { Shortcut, UseShortcuts } from "$lib/shortcuts/index.js";
  import ShortcutsHelpModal from "./ShortcutsHelpModal.svelte";
  import type { ShortcutsHelpModalMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/ShortcutsHelpModal",
    tags: ["autodocs"],
    component: ShortcutsHelpModal,
  });
</script>

<script lang="ts">
  let modalMethods = $state<ShortcutsHelpModalMethods>();

  const localShortcuts = [
    new Shortcut("ctrl+s", "Save Document", () => {}),
    new Shortcut("ctrl+o", "Open Document", () => {}),
  ];

  const globalShortcuts = [
    new Shortcut("ctrl+/", "Show Shortcuts Help", () => {
      modalMethods?.showModal();
    }),
    new Shortcut("ctrl+q", "Quit Application", () => {}),
    new Shortcut("ctrl+w", "Close Window", () => {}),
  ];
</script>

<Story name="Default">
  {#snippet template(args)}
    <!-- 
      <script lang="ts">
        let modalMethods = $state<ShortcutsHelpModalMethods>();

        const localShortcuts = [
          new Shortcut("ctrl+s", "Save Document", () => {}),
          new Shortcut("ctrl+o", "Open Document", () => {}),
        ];

        const globalShortcuts = [
          new Shortcut("ctrl+/", "Show Shortcuts Help", () => {
            modalMethods?.showModal();
          }),
          new Shortcut("ctrl+q", "Quit Application", () => {}),
          new Shortcut("ctrl+w", "Close Window", () => {}),
      ];
      </script>
    -->
    <GlobalShortcutsProvider>
      <UseShortcuts shortcuts={globalShortcuts} />
      <ShortcutsHelpModal bind:this={modalMethods} {...args} />
      <ShortcutsProvider>
        <UseShortcuts shortcuts={localShortcuts} />
        <ShortcutsHelpModal {...args}>
          {#snippet trigger(_, showModal)}
            <Button onclick={showModal}>Open local shortcuts help</Button>
          {/snippet}
        </ShortcutsHelpModal>
        or press <kbd>Ctrl</kbd>+<kbd>/</kbd> to open global shortcuts help.
      </ShortcutsProvider>
    </GlobalShortcutsProvider>
  {/snippet}
</Story>
