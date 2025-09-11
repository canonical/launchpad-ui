<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { OptionsPanel } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { setComboboxContext } from "./context.js";
  import type { ComboboxProps } from "./types.js";

  let {
    search,
    type = "multi-select",
    children,
    inputsName,
    "aria-busy": ariaBusyProp,
    ...rest
  }: ComboboxProps = $props();

  const listBoxId = $props.id();
  let listBoxElement = $state<HTMLDivElement>();
  let activeDescendant = $state<string | null>(null);
  const selectionListeners = new Map<string, () => void>();
  const radioCheckListeners = new Set<(id: string) => void>();
  let loadingCount = $state(0);

  setComboboxContext({
    get listBoxElement() {
      return listBoxElement;
    },
    get activeDescendant() {
      return activeDescendant;
    },
    set activeDescendant(id: string | null) {
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
    loadingShown: () => {
      loadingCount += 1;
      return () => {
        loadingCount -= 1;
      };
    },
  });

  const ariaBusy = $derived(ariaBusyProp ?? loadingCount > 0);
  const isMounted = useIsMounted();
</script>

<OptionsPanel data-testid="combobox" {...rest}>
  {@render search()}
  <div
    bind:this={listBoxElement}
    id={listBoxId}
    {...isMounted.value
      ? {
          role: "listbox",
          "aria-multiselectable": type === "multi-select",
          "aria-busy": ariaBusy,
        }
      : {}}
  >
    {@render children?.()}
  </div>
</OptionsPanel>

<!-- @component
`Combobox` is a component that provides a list of options that can be filtered or searched through an input field.

When `Combobox.Search` is focused, user can navigate the options using the arrow keys, and select an option using the Enter key.

Combobox supports both single and multi-select modes, which can be set using the `type` prop and utilizing `Combobox.RadioOption` and `Combobox.CheckboxOption` respectively.

Displaying a `Combobox.Loading` component inside the `Combobox` will automatically set `aria-busy="true"` on the options container, and remove it when the component is unmounted (unless `aria-busy` is explicitly provided on the `Combobox`).

## Example Usage
```svelte
<Combobox inputsName="example" type="multi-select">
  {#snippet search()}
    <Combobox.Search bind:value={query} label="Search options" />
  {/snippet}
  {#if isLoading}
    <Combobox.Loading />
  {:else}
    <Combobox.Group groupTitle="Group 1">
      {#each options.filter(option => option.text.includes(query)) as option (option.id)}
        <Combobox.CheckboxOption
          text={option.text}
          secondaryText={option.secondaryText}
          bind:checked={option.checked}
        />
      {/each}
    </Combobox.Group>
  {/if}
  {#snippet helper(id)}
    <Combobox.Helper {id} text="Select an option" />
  {/snippet}
  {#snippet footer()}
    <Combobox.Footer>
      <Button>Cancel</Button>
      <Button>Save</Button>
    </Combobox.Footer>
  {/snippet}
</Combobox>
```
-->
