<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import GlobalShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/GlobalShortcutsProvider.svelte";
  import ShortcutsProvider from "$lib/shortcuts/ShortcutsProvider/ShortcutsProvider.svelte";
  import { Shortcut, UseShortcuts } from "$lib/shortcuts/index.js";
  import ShortcutsHelpSidePanel from "./ShortcutsHelpSidePanel.svelte";

  const { Story } = defineMeta({
    title: "Components/ShortcutsHelpSidePanel",
    tags: ["autodocs"],
    component: ShortcutsHelpSidePanel,
  });
</script>

<script lang="ts">
  let globalPanelOpen = $state(false);

  const localShortcuts = [
    new Shortcut("ctrl+s", { label: "Save Document" }, () => {}),
    new Shortcut("ctrl+o", { label: "Open Document" }, () => {}),
  ];

  const globalShortcuts = [
    new Shortcut("ctrl+/", { label: "Show Shortcuts Help" }, () => {
      globalPanelOpen = true;
    }),
    new Shortcut("ctrl+q", { label: "Quit Application" }, () => {}),
    new Shortcut("ctrl+w", { label: "Close Window" }, () => {}),
  ];
</script>

<Story name="Default">
  {#snippet template(args)}
    <!-- 
      <script lang="ts">
        let globalPanelOpen = $state(false);

        const localShortcuts = [
          new Shortcut("ctrl+s", { label: "Save Document" }, () => {}),
          new Shortcut("ctrl+o", { label: "Open Document" }, () => {}),
        ];

        const globalShortcuts = [
          new Shortcut("ctrl+/", { label: "Show Shortcuts Help" }, () => {
            globalPanelOpen = true;
          }),
          new Shortcut("ctrl+q", { label: "Quit Application" }, () => {}),
          new Shortcut("ctrl+w", { label: "Close Window" }  , () => {}),
      ];
      </script>
    -->
    <GlobalShortcutsProvider>
      <UseShortcuts shortcuts={globalShortcuts} />
      <ShortcutsHelpSidePanel {...args} bind:open={globalPanelOpen} />
      <ShortcutsProvider>
        <UseShortcuts shortcuts={localShortcuts} />
        <ShortcutsHelpSidePanel {...args}>
          {#snippet trigger(triggerProps)}
            <Button {...triggerProps}>Open local shortcuts help</Button>
          {/snippet}
        </ShortcutsHelpSidePanel>
        or press <kbd>Ctrl</kbd>+<kbd>/</kbd> to open global shortcuts help.
      </ShortcutsProvider>
    </GlobalShortcutsProvider>
  {/snippet}
</Story>
