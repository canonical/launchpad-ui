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
    if (currentId === null) return options[0].id || null;

    const currentIndex = options.findIndex((option) => option.id === currentId);
    if (currentIndex === -1) return null;
    const nextIndex =
      (currentIndex + (direction === "next" ? 1 : -1) + options.length) %
      options.length;
    return options[nextIndex].id || null;
  }
</script>

<script lang="ts">
  import type { KeyboardEventHandler } from "svelte/elements";
  import { TextInput } from "$lib/components/TextInput/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { getComboboxContext } from "../../context.js";
  import type { SearchProps } from "./types.js";

  let {
    style,
    label,
    onkeydown: onkeydownProp,
    ...rest
  }: SearchProps = $props();

  const comboboxContext = getComboboxContext();

  const isMounted = useIsMounted();

  const onkeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    onkeydownProp?.(event);
    if (event.defaultPrevented) return;
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
    }
  };

  const arias = $derived(
    isMounted.value
      ? ({
          role: "combobox",
          "aria-haspopup": "listbox",
          "aria-controls": comboboxContext?.listBoxId,
          "aria-autocomplete": "list",
          "aria-activedescendant": comboboxContext?.activeDescendant,
        } as const)
      : {},
  );
</script>

<!-- TODO: Replace with <SearchBox> -->
<TextInput
  type="search"
  aria-label={label}
  style={`width: 100%; ${style}`}
  {onkeydown}
  {...arias}
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
