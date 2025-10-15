<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ModalContent } from "$lib/components/ModalContent/index.js";
  import { Shortcut, useShortcuts } from "$lib/shortcuts/index.js";
  import type { SidePanelMethods } from "../SidePanel";
  import { SidePanel } from "../SidePanel";
  import TextInput from "../TextInput/TextInput.svelte";
  import "./styles.css";
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
    <ModalContent class="content">
      <ModalContent.Header>
        <h4>Command guide</h4>
        <ModalContent.Header.CloseButton onclick={close} />
      </ModalContent.Header>
      <ModalContent.Body class="body">
        <TextInput
          type="search"
          autofocus
          placeholder="Search"
          aria-label="Search shortcuts"
          class="shortcuts-help-modal-search"
          bind:value={filterQuery}
        />
        {#each Object.entries(groupedByCategory) as [category, shortcuts] (category)}
          <section>
            <div class="title">
              <h5>{category}</h5>
              <span aria-hidden="true">Shortcut</span>
              <span aria-hidden="true">Description</span>
            </div>
            <dl>
              {#each shortcuts as shortcut (shortcut)}
                <dt>{shortcut.metadata.label}</dt>
                <dd>
                  <span class="visually-hidden">Shortcut:</span>
                  {shortcut.toHumanReadable()}
                </dd>
                {#if shortcut.metadata.description}
                  <dd class="description">
                    <span class="visually-hidden">Description:</span>
                    {shortcut.metadata.description}
                  </dd>
                {/if}
              {/each}
            </dl>
          </section>
        {/each}
      </ModalContent.Body>
    </ModalContent>
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
