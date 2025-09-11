<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { OptionsPanel } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { setComboboxContext } from "./context.js";
  import type { ComboboxProps } from "./types.js";

  let {
    search,
    type = "multi",
    children,
    inputsName,
    ...rest
  }: ComboboxProps = $props();

  const listBoxId = $props.id();
  let listBoxElement = $state<HTMLDivElement>();
  let activeDescendant = $state<string | null>(null);
  const selectionListeners = new Map<string, () => void>();
  const radioCheckListeners = new Set<(id: string) => void>();

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
    listenForOptionSelect: (id: string, callback: () => void) => {
      selectionListeners.set(id, callback);
      return () => {
        selectionListeners.delete(id);
      };
    },
    get inputsName() {
      return inputsName;
    },
    notifyRadioChecked: (id: string) => {
      for (const listener of radioCheckListeners) {
        listener(id);
      }
    },
    listenForRadioCheck: (callback: (id: string) => void) => {
      radioCheckListeners.add(callback);
      return () => {
        radioCheckListeners.delete(callback);
      };
    },
  });

  const isMounted = useIsMounted();
</script>

<OptionsPanel {...rest}>
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
    {@render children?.()}
  </div>
</OptionsPanel>

<!-- @component
`Combobox` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Combobox class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Combobox>
```
-->
