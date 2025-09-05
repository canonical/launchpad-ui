<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { Popover } from "$lib/components/Popover/index.js";
  import type { PopoverMethods } from "$lib/components/Popover/index.js";
  import { OptionsPanel } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { setComboboxContext } from "./context.js";
  import type { ComboboxMethods, InternalComboboxRootProps } from "./types.js";

  const componentCssClassName = "ds combobox";

  let {
    class: className,
    search,
    footer: footerProp,
    helper,
    children: childrenProp,
    type,
    ...rest
  }: InternalComboboxRootProps = $props();

  const listBoxId = $props.id();
  let listBoxElement = $state<HTMLDivElement>();
  let activeDescendant = $state<string | null>(null);
  const selectionListeners = new Map<string, () => void>();

  setComboboxContext({
    listBoxId,
    get listBoxElement() {
      return listBoxElement;
    },
    get activeDescendant() {
      return activeDescendant;
    },
    setActiveDescendant: (id: string | null) => {
      activeDescendant = id;
    },
    selectOption: (id: string) => {
      selectionListeners.get(id)?.();
    },
    listenForSelect: (id: string, callback: () => void) => {
      selectionListeners.set(id, callback);
      return () => {
        selectionListeners.delete(id);
      };
    },
  });

  let popoverMethods = $state<PopoverMethods>();

  export const showCombobox: ComboboxMethods["showCombobox"] = () => {
    popoverMethods?.showPopover();
  };

  export const hideCombobox: ComboboxMethods["hideCombobox"] = () => {
    popoverMethods?.hidePopover();
  };

  export const toggleCombobox: ComboboxMethods["toggleCombobox"] = () => {
    popoverMethods?.togglePopover();
  };

  const isMounted = useIsMounted();
</script>

<Popover
  bind:this={popoverMethods}
  class={[className, componentCssClassName]}
  {...rest}
>
  {#snippet children(popovertarget)}
    <div class="{componentCssClassName}-content">
      <OptionsPanel {helper}>
        {@render search()}
        <div
          bind:this={listBoxElement}
          id={listBoxId}
          {...isMounted.value
            ? {
                role: "listbox",
                "aria-multiselectable": type === "multi",
              }
            : {}}
        >
          {@render childrenProp(popovertarget)}
        </div>
        {#snippet footer()}
          {@render footerProp?.(popovertarget)}
        {/snippet}
      </OptionsPanel>
    </div>
  {/snippet}
</Popover>

<!-- @component
`ComboboxContent` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ComboboxContent class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ComboboxContent>
```
-->

<style>
  .ds.combobox-content {
    /* TODO(@Enzo): Add token */
    --dimension-width-combobox: 20rem;

    width: var(--dimension-width-combobox);
  }
</style>
