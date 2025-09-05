<!-- @canonical/generator-ds 0.10.0-experimental.2 -->
<script module lang="ts">
  function getSiblingOptionId(
    listBoxElement: HTMLElement,
    currentId: string | null,
    direction: "next" | "previous",
  ): string | null {
    const options = Array.from(
      listBoxElement.querySelectorAll<HTMLElement>('[role="option"]'),
    );

    if (options.length === 0) return null;

    const fallback =
      (direction === "next" ? options.at(0)?.id : options.at(-1)?.id) || null;

    // No option selected
    if (currentId === null) return fallback;

    const currentIndex = options.findIndex((option) => option.id === currentId);
    // Last selected option for some reason no longer exists
    if (currentIndex === -1) return fallback;

    const nextIndex =
      direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex < 0 || nextIndex >= options.length) {
      // According to WAI-ARIA Combobox Pattern, selection should not wrap
      // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/#:~:text=of%20the%20combobox.-,Down%20Arrow,first%20option%2C%20either%20returns%20focus%20to%20the%20combobox%20or%20does%20nothing.,-Right%20Arrow
      return currentId;
    }

    return options.at(nextIndex)?.id || null;
  }
</script>

<script lang="ts">
  import type {
    FocusEventHandler,
    KeyboardEventHandler,
  } from "svelte/elements";
  import { TextInput } from "$lib/components/TextInput/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../ComboboxRoot/context.js";
  import type { SearchProps } from "./types.js";

  let {
    style,
    label,
    onkeydown: onkeydownProp,
    onblur: onblurProp,
    value = $bindable(),
    ...rest
  }: SearchProps = $props();

  const comboboxContext = getComboboxContext();

  const isMounted = useIsMounted();

  const onkeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
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
      comboboxContext.setActiveDescendant(nextId);
    } else if (event.key === "Enter" && comboboxContext.activeDescendant) {
      comboboxContext.selectOption(comboboxContext.activeDescendant);
      event.preventDefault();
    }
  };

  const onblur: FocusEventHandler<HTMLInputElement> = (event) => {
    onblurProp?.(event);
    // Clear active descendant on blur
    comboboxContext?.setActiveDescendant(null);
  };
</script>

<!-- TODO: Replace with <SearchBox> -->
<TextInput
  type="search"
  aria-label={label}
  style={`width: 100%; ${style}`}
  bind:value
  {onkeydown}
  {onblur}
  {...isMounted.value
    ? {
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-controls": comboboxContext?.listBoxId,
        "aria-autocomplete": "list",
      }
    : {}}
  aria-activedescendant={comboboxContext?.activeDescendant}
  {...rest}
/>

<!-- @component
`Search` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Search class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Search>
```
-->
