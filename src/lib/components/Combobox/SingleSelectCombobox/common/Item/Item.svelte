<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import type { ChangeEventHandler } from "svelte/elements";
  import { RadioOption } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../../common/index.js";
  import { getSingleSelectComboboxContext } from "../../context.js";
  import type { ItemProps } from "./types.js";
  import "./styles.css";

  let {
    id: idProp,
    checked,
    onchange: onchangeProp,
    class: className,
    ...rest
  }: ItemProps = $props();

  const comboboxContext = getComboboxContext();
  const singleSelectComboboxContext = getSingleSelectComboboxContext();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isActive = $derived(id === comboboxContext?.activeDescendant);

  const onchange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onchangeProp?.(e);
    if (singleSelectComboboxContext) {
      singleSelectComboboxContext.selectedItemId = id;
    }
  };

  // 1. React to external changes to `checked` prop
  let ariaChecked = $derived(Boolean(checked));
  $effect(() => {
    if (!singleSelectComboboxContext) return;
    // 2. React to changes of selection due to user interaction
    ariaChecked = singleSelectComboboxContext.selectedItemId === id;
  });

  const selectListener: Attachment<HTMLInputElement> = (node) => {
    if (!comboboxContext) return;

    const unregister = comboboxContext.listenForSelect(id, () => {
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
</script>

<RadioOption
  {id}
  bind:labelRef
  {checked}
  {onchange}
  name={singleSelectComboboxContext?.inputsName}
  class={["ds combobox-item", className, { active: isActive }]}
  {...isMounted.value
    ? { tabindex: -1, role: "option", "aria-selected": ariaChecked }
    : {}}
  {...rest}
  {@attach selectListener}
/>

<!-- @component
`Item` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Item class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Item>
```
-->
