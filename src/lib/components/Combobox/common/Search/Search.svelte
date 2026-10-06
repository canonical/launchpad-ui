<!-- @canonical/generator-ds 0.10.0-experimental.2 -->
<script lang="ts">
  import { SearchBox, useIsMounted } from "@canonical/svelte-ds-app-launchpad";
  import { getComboboxContext } from "../../context.js";
  import type { SearchProps } from "./types.js";
  import { getSiblingOptionId } from "./utils/getSiblingOptionId.js";

  const componentCssClassName = "ds combobox-search";

  let {
    onkeydown: onkeydownProp,
    onblur: onblurProp,
    onkeydownUnhandled,
    value = $bindable(),
    class: className,
    ...rest
  }: SearchProps = $props();

  const comboboxContext = getComboboxContext();

  const isMounted = useIsMounted();

  const onkeydown: typeof onkeydownProp = (event) => {
    onkeydownProp?.(event);
    if (event.defaultPrevented) return;

    if (comboboxContext?.listBoxElement) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const nextId = getSiblingOptionId(
          comboboxContext.listBoxElement,
          comboboxContext.activeDescendant,
          event.key === "ArrowDown" ? "next" : "previous",
        );
        event.preventDefault();
        comboboxContext.activeDescendant = nextId;
        return;
      }
      if (event.key === "Enter" && comboboxContext.activeDescendant) {
        event.preventDefault();
        comboboxContext.selectOption(comboboxContext.activeDescendant);
        return;
      }
    }
    onkeydownUnhandled?.(event);
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
  class={[componentCssClassName, className]}
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

<style>
  :global {
    .ds.combobox-search {
      position: sticky;
      inset-block-start: 0;
      z-index: 1;

      > input {
        min-width: 0;
      }
    }
  }
</style>
