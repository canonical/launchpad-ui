<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import { CheckboxOption } from "$lib/components/common/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../../common/index.js";
  import type { ItemProps } from "./types.js";
  import "./styles.css";

  let {
    id: idProp,
    checked = $bindable(),
    class: className,
    ...rest
  }: ItemProps = $props();

  const comboboxContext = getComboboxContext();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const isActive = $derived(id === comboboxContext?.activeDescendant);

  const selectListener: Attachment<HTMLInputElement> = (node) => {
    if (!comboboxContext) return;

    const unregister = comboboxContext.listenForSelect(id, () => {
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
  class={["ds combobox-item", className, { active: isActive }]}
  {...isMounted.value
    ? { tabindex: -1, role: "option", "aria-selected": Boolean(checked) }
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
