<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { RadioOption } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../context.js";
  import type { RadioOptionProps } from "./types.js";

  let {
    id: idProp,
    checked,
    onchange: onchangeProp,
    class: className,
    ...rest
  }: RadioOptionProps = $props();

  const comboboxContext = getComboboxContext();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isActive = $derived(id === comboboxContext?.activeDescendant);

  const selectListener: Attachment<HTMLInputElement> = (node) => {
    if (!comboboxContext) return;

    const unregister = comboboxContext.listenForOptionSelect(id, () => {
      if (node.checked) return;
      node.checked = true;
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

  // 1. React to external changes to `checked` prop
  let ariaSelected = $derived(Boolean(checked));

  $effect(() => {
    // 2. Notify other radios that this one just got checked by external prop change.
    // In case there are multiple radios with `checked` being true, the last one to mount wins.
    if (checked) {
      comboboxContext?.notifyRadioChecked(untrack(() => id));
    }
  });

  onMount(() => {
    // 3. Uncheck if some other radio got checked
    const unregister = comboboxContext?.listenForRadioCheck((checkedId) => {
      if (checkedId !== id) {
        ariaSelected = false;
      }
    });
    return () => unregister?.();
  });

  const onchange: typeof onchangeProp = (event) => {
    onchangeProp?.(event);
    ariaSelected = true;
    // 4. Notify other radios that this one just got checked, by user interaction.
    comboboxContext?.notifyRadioChecked(id);
  };
</script>

<RadioOption
  {id}
  bind:labelRef
  {checked}
  {onchange}
  name={comboboxContext?.inputsName}
  class={["ds combobox-option", className, { active: isActive }]}
  {...isMounted.value
    ? { role: "option", "aria-selected": ariaSelected, inert: true }
    : {}}
  {...rest}
  {@attach selectListener}
/>

<!-- @component
`Combobox.RadioOption` represents a selectable option within a `Combobox` with `type="single-select"`.

## Example Usage
```svelte
<Combobox.RadioOption text="Option 1" checked />
<Combobox.RadioOption text="Option 2" secondaryText="Additional info" onchange={handleChange} />
<Combobox.RadioOption text="Option 3" >
  {#snippet icon()}
    <Icon name="check" />
  {/snippet}
</Combobox.RadioOption>
```
-->

<style>
  :global(.ds.combobox-option.active) {
    outline: var(--focus-outline);
    outline-offset: var(--focus-outline-offset);
  }
</style>
