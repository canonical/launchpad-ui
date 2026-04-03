<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { TextInput } from "@canonical/svelte-ds-app-launchpad";
  import { Shortcut, useShortcuts } from "$lib/shortcuts/index.js";
  import type { SidePanelMethods } from "../SidePanel";
  import { SidePanel } from "../SidePanel/index.js";
  import { Section } from "./common/index.js";
  import type {
    ShortcutsHelpSidePanelMethods,
    ShortcutsHelpSidePanelProps,
  } from "./types.js";

  const componentCssClassName = "ds shortcuts-help-side-panel";
  const props: ShortcutsHelpSidePanelProps = $props();
  let sidePanelMethods = $state<SidePanelMethods>();

  export const showModal: ShortcutsHelpSidePanelMethods["showModal"] = () => {
    sidePanelMethods?.showModal();
  };

  export const close: ShortcutsHelpSidePanelMethods["close"] = () => {
    sidePanelMethods?.close();
  };

  const shortcuts = useShortcuts();
  let filterQuery = $state("");

  const filteredShortcuts = $derived.by(() => {
    const query = filterQuery.toLowerCase();
    return shortcuts()
      .filter((shortcut) => shortcut.enabled)
      .filter(
        (shortcut) =>
          shortcut.metadata.label.toLowerCase().includes(query) ||
          shortcut.metadata.description?.toLowerCase().includes(query) ||
          shortcut.metadata.category?.toLowerCase().includes(query),
      );
  });

  const defaultCategory = "General";

  const groupedByCategory = $derived.by(() => {
    const grouped: Record<string, Shortcut[]> = {};
    for (const shortcut of filteredShortcuts) {
      const category = shortcut.metadata.category || defaultCategory;
      grouped[category] ??= [];
      grouped[category].push(shortcut);
    }
    return grouped;
  });
</script>

<SidePanel
  bind:this={sidePanelMethods}
  class={componentCssClassName}
  {...props}
>
  {#snippet children(_, close)}
    <SidePanel.Content class="content">
      <SidePanel.Content.Header>
        <h4>Command guide</h4>
        <SidePanel.Content.Header.CloseButton onclick={close} />
      </SidePanel.Content.Header>
      <SidePanel.Content.Body class="body">
        <TextInput
          type="search"
          autofocus
          placeholder="Search"
          aria-label="Search shortcuts"
          class="shortcuts-help-modal-search"
          bind:value={filterQuery}
        />
        <div class="shortcuts">
          {#each Object.entries(groupedByCategory) as [category, shortcuts] (category)}
            <Section {category} {shortcuts} />
          {/each}
        </div>
      </SidePanel.Content.Body>
    </SidePanel.Content>
  {/snippet}
</SidePanel>

<!-- @component
 `ShortcutsHelpSidePanel` is a side panel dialog that displays a list of enabled keyboard shortcuts registered in the nearest `ShortcutsProvider`.

  ## Example Usage
  ```svelte
  <ShortcutsProvider>
    <UseShortcuts shortcuts={new Shortcut("ctrl+/", "Show Shortcuts Help", () => {
      modalMethods?.showModal();
    })} />
    <ShortcutsHelpSidePanel bind:this={modalMethods} />
    <YourAppComponents />
  </ShortcutsProvider>
  ```
-->

<style>
  :global {
    .ds.shortcuts-help-side-panel {
      --dimension-margin-block-shortcuts-help-modal-section: var(
        --lp-dimension-spacing-block-xxl
      );
      --dimension-margin-block-shortcuts-help-modal-section-items: var(
        --lp-dimension-spacing-block-m
      );
      --typography-shortcuts-help-modal-dt: var(--lp-typography-paragraph-xs);
      --typography-shortcuts-help-modal-dd: var(--lp-typography-paragraph-xs);

      .content {
        display: grid;
        grid-template-rows: auto auto minmax(0, 1fr);
        height: 100%;

        > .body {
          display: contents;

          > .shortcuts {
            overflow-y: auto;
            contain: strict;
          }
        }
      }
    }
  }
</style>
