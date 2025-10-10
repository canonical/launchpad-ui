<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ModalContent } from "$lib/components/ModalContent/index.js";
  import { Shortcut, useShortcuts } from "$lib/shortcuts/index.js";
  import Search from "../Combobox/common/Search/Search.svelte";
  import type { SidePanelMethods } from "../SidePanel";
  import { SidePanel } from "../SidePanel";
  import "./styles.css";
  import type {
    ShortcutsHelpModalMethods,
    ShortcutsHelpModalProps,
  } from "./types.js";

  const componentCssClassName = "ds shortcuts-help-modal";
  const props: ShortcutsHelpModalProps = $props();
  let sidePanelMethods = $state<SidePanelMethods>();

  export const show: ShortcutsHelpModalMethods["show"] = () => {
    sidePanelMethods?.show();
  };

  export const close: ShortcutsHelpModalMethods["close"] = () => {
    sidePanelMethods?.close();
  };

  const shortcuts = useShortcuts();
  let filterQuery = $state("");

  const filteredShortcuts = $derived(
    shortcuts()
      .filter((shortcut) => shortcut.enabled)
      .filter(
        (shortcut) =>
          shortcut.metadata.label
            .toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          shortcut.metadata.description
            ?.toLowerCase()
            .includes(filterQuery.toLowerCase()) ||
          shortcut.metadata.category
            ?.toLowerCase()
            .includes(filterQuery.toLowerCase()),
      ),
  );
  const defaultCategory = "General";

  const groupedByCategory = $derived.by(() => {
    const grouped: Record<string, Shortcut[]> = {};
    for (const shortcut of filteredShortcuts) {
      grouped[shortcut.metadata.category || defaultCategory] =
        grouped[shortcut.metadata.category || defaultCategory] || [];
      grouped[shortcut.metadata.category || defaultCategory].push(shortcut);
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
    <ModalContent>
      <ModalContent.Header>
        <div class="title">
          Command guide
          <ModalContent.Header.CloseButton onclick={close} />
        </div>
        <Search
          label="Search shortcuts"
          autofocus
          placeholder="Search"
          bind:value={filterQuery}
        />
      </ModalContent.Header>
      <ModalContent.Body class="body">
        {#each Object.entries(groupedByCategory) as [category, shortcuts] (category)}
          <section>
            <dl>
              <h5>{category}</h5>
              <h5>Shortcut</h5>
              <h5>Description</h5>
            </dl>
            <dl>
              {#each shortcuts as shortcut (shortcut.metadata.label)}
                <dt>{shortcut.metadata.label}</dt>
                <dd>{shortcut.toHumanReadable()}</dd>
                <dd>{shortcut.metadata.description}</dd>
              {/each}
            </dl>
          </section>
        {/each}
      </ModalContent.Body>
    </ModalContent>
  {/snippet}
</SidePanel>

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
