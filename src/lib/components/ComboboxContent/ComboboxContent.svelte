<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import { OptionsPanel } from "../Options/index.js";
  import { setComboboxContext } from "./context.js";
  import type { ComboboxContentProps } from "./types.js";

  const componentCssClassName = "ds combobox-content";

  let {
    class: className,
    search,
    footer,
    helper,
    children,
    type = "multi",
    ...rest
  }: ComboboxContentProps = $props();

  const listBoxId = $props.id();
  let listBoxElement = $state<HTMLDivElement>();
  let activeDescendant = $state<string | null>(null);

  setComboboxContext({
    get type() {
      return type;
    },
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
  });

  const isMounted = useIsMounted();

  const listBoxArias = $derived(
    isMounted.value
      ? ({
          role: "listbox",
          "aria-multiselectable": type === "multi",
        } as const)
      : {},
  );
</script>

<div class={[className, componentCssClassName]} {...rest}>
  {@render search()}
  <OptionsPanel
    bind:ref={listBoxElement}
    id={listBoxId}
    {footer}
    {helper}
    {children}
    {...listBoxArias}
  />
</div>

<!-- @component
`ComboboxContent` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ComboboxContent class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ComboboxContent>
```
-->

<style>
  .ds.combobox-content {
    --color-background-combobox-content: var(--tmp-color-background-default);
    --border-combobox-content: var(--dimension-stroke-thickness-default) solid
      var(--tmp-color-border-high-contrast);

    background-color: var(--color-background-combobox-content);
    border: var(--border-combobox-content);

    :global(.ds.options-panel) {
      border: none;
      --color-background-options-panel: var(
        --color-background-combobox-content
      );
    }
  }
</style>
