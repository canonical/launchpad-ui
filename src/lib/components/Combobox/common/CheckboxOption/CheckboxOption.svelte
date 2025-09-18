<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { CheckboxOption } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../context.js";
  import type { CheckboxOptionProps } from "./types.js";
  import "./styles.css";

  let {
    id: idProp,
    checked = $bindable(),
    class: className,
    ...rest
  }: CheckboxOptionProps = $props();

  const comboboxContext = getComboboxContext();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isActive = $derived(id === comboboxContext?.activeDescendant);

  const selectListener: Attachment<HTMLInputElement> = (node) => {
    if (!comboboxContext) return;

    const unregister = comboboxContext.listenForOptionSelect(id, () => {
      node.checked = !node.checked;
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    });

    return () => unregister();
  };

  const isMounted = useIsMounted();

  let labelRef = $state<HTMLLabelElement>();
  $effect(() => {
    // Scroll into view whenever option becomes active
    if (!isActive) return;
    labelRef?.scrollIntoView({ block: "nearest" });
  });
</script>

<CheckboxOption
  {id}
  bind:checked
  bind:labelRef
  class={["ds combobox-option", className, { active: isActive }]}
  name={comboboxContext?.inputsName}
  {...isMounted.value
    ? {
        role: "option",
        "aria-selected": Boolean(checked),
        inert: true,
      }
    : {}}
  {...rest}
  {@attach selectListener}
/>

<!-- @component
`Combobox.CheckboxOption` represents a selectable option within a `Combobox` with `type="multi-select"`.

## Example Usage
```svelte
<Combobox.CheckboxOption text="Option 1" bind:checked />
<Combobox.CheckboxOption text="Option 2" secondaryText="Additional info" onchange={handleChange} />
<Combobox.CheckboxOption text="Option 3" >
  {#snippet icon()}
    <Icon name="check" />
  {/snippet}
</Combobox.CheckboxOption>
```
-->
