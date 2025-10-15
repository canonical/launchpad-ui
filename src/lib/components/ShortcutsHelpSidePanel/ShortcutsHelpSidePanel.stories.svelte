<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Button } from "$lib/components/Button/index.js";
  import GlobalShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/GlobalShortcutsProvider.svelte";
  import ShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/ShortcutsProvider.svelte";
  import { Shortcut, UseShortcuts } from "$lib/shortcuts/index.js";
  import ShortcutsHelpSidePanel from "./ShortcutsHelpSidePanel.svelte";
  import type { ShortcutsHelpSidePanelMethods } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/ShortcutsHelpSidePanel",
    tags: ["autodocs"],
    component: ShortcutsHelpSidePanel,
  });
</script>

<script lang="ts">
  let modalMethods = $state<ShortcutsHelpSidePanelMethods>();

  const localShortcuts = [
    new Shortcut("ctrl+s", { label: "Save Document" }, () => {}),
    new Shortcut("ctrl+o", { label: "Open Document" }, () => {}),
  ];

  const globalShortcuts = [
    new Shortcut("ctrl+/", { label: "Show Shortcuts Help" }, () => {
      modalMethods?.showModal();
    }),
    new Shortcut("ctrl+q", { label: "Quit Application" }, () => {}),
    new Shortcut("ctrl+w", { label: "Close Window" }, () => {}),
  ];
</script>

<Story name="Default">
  {#snippet template(args)}
    <!-- 
      <script lang="ts">
        let modalMethods = $state<ShortcutsHelpSidePanelMethods>();

        const localShortcuts = [
          new Shortcut("ctrl+s", { label: "Save Document" }, () => {}),
          new Shortcut("ctrl+o", { label: "Open Document" }, () => {}),
        ];

        const globalShortcuts = [
          new Shortcut("ctrl+/", { label: "Show Shortcuts Help" }, () => {
            modalMethods?.showModal();
          }),
          new Shortcut("ctrl+q", { label: "Quit Application" }, () => {}),
          new Shortcut("ctrl+w", { label: "Close Window" }  , () => {}),
      ];
      </script>
    -->
    <GlobalShortcutsProvider>
      <UseShortcuts shortcuts={globalShortcuts} />
      <ShortcutsHelpSidePanel bind:this={modalMethods} {...args} />
      <ShortcutsProvider>
        <UseShortcuts shortcuts={localShortcuts} />
        <ShortcutsHelpSidePanel {...args}>
          {#snippet trigger(_, showModal)}
            <Button onclick={showModal}>Open local shortcuts help</Button>
          {/snippet}
        </ShortcutsHelpSidePanel>
        or press <kbd>Ctrl</kbd>+<kbd>/</kbd> to open global shortcuts help.
      </ShortcutsProvider>
    </GlobalShortcutsProvider>
  {/snippet}
</Story>
