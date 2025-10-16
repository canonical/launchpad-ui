<!-- @canonical/generator-ds 0.10.0-experimental.2 -->
<script lang="ts">
  import { SearchBox } from "$lib/components/SearchBox/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../context.js";
  import type { SearchProps } from "./types.js";
  import { getSiblingOptionId } from "./utils/getSiblingOptionId.js";

  let {
    onkeydown: onkeydownProp,
    onblur: onblurProp,
    value = $bindable(),
    ...rest
  }: SearchProps = $props();

  const comboboxContext = getComboboxContext();

  const isMounted = useIsMounted();

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (!comboboxContext || !comboboxContext.listBoxElement) return;

    let nextId: string | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      nextId = getSiblingOptionId(
        comboboxContext.listBoxElement,
        comboboxContext.activeDescendant,
        event.key === "ArrowDown" ? "next" : "previous",
      );
      event.preventDefault();
      comboboxContext.activeDescendant = nextId;
    } else if (event.key === "Enter" && comboboxContext.activeDescendant) {
      comboboxContext.selectOption(comboboxContext.activeDescendant);
      event.preventDefault();
    }
  };

  const onblur: typeof onblurProp = (event) => {
    onblurProp?.(event);
    if (comboboxContext) {
      comboboxContext.activeDescendant = null;
    }
  };
</script>

<SearchBox
  bind:value
  {onkeydown}
  {onblur}
  {...isMounted.value
    ? {
        role: "combobox",
        "aria-controls": comboboxContext?.listBoxElement?.id,
        "aria-autocomplete": "list",
        /*
          The `aria-expanded` is a bit problematic here, due to the fact that:
          - it has to be set as `aria-expanded` is a required attribute for `role="combobox"` (https://docs.rodeo/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/combobox_role);
          - our combobox is a bit different from a typical one, as the options visibility is not toggled by the input;
          - MDN says: "Avoid including it on elements that do not control the expanded state of other elements" (https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded).

          as such:
          - we always set it to `true`, as our combobox options are always visible when the combobox is rendered.

          but:
          TODO: Revisit this decision and discuss whether this whole component is a combobox after all.
        */
        "aria-expanded": true,
      }
    : {}}
  aria-activedescendant={comboboxContext?.activeDescendant}
  {...rest}
/>

<!-- @component
`Combobox.Search` is a search input field designed to filter options within a `Combobox`.

It provides keyboard navigation support to move through the combobox's options using up and down arrow keys and select an option with the Enter key.

## Example Usage
```svelte
<Combobox.Search label="Search options" placeholder="Type to filter..." bind:value />
```
-->
