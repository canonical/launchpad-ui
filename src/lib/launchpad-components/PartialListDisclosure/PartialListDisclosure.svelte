<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { PartialListDisclosureProps } from "./types.js";

  const componentCssClassName = "ds partial-list-disclosure";

  let { children }: PartialListDisclosureProps = $props();

  const id = $props.id();

  let isExpanded = $state(false);
</script>

{@render children(
  {
    id,
    class: componentCssClassName,
  },
  { class: { hidden: !isExpanded } },
  {
    class: [componentCssClassName, "toggle-button"],
    "aria-expanded": isExpanded,
    "aria-controls": id,
    onclick: () => (isExpanded = !isExpanded),
  },
  isExpanded,
)}

<!-- @component
`PartialListDisclosure` is a component that allows you to display a partial list of items with the ability to expand and collapse the list to show or hide additional items.

If scripting is disabled, the toggle button will be hidden and all items will be shown.

## Example Usage
```svelte
<PartialListDisclosure>
  <PartialListDisclosure>
    {#snippet children(
      listProps,
      hiddenItemProps,
      toggleButtonProps,
      isExpanded,
    )}
      <ul {...listProps}>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
        <li {...hiddenItemProps}>Item 4</li>
        <li {...hiddenItemProps}>Item 5</li>
        <li {...hiddenItemProps}>Item 6</li>
        <li {...hiddenItemProps}>Item 7</li>
        <li {...hiddenItemProps}>Item 8</li>
        <li {...hiddenItemProps}>Item 9</li>
      </ul>
      <button {...toggleButtonProps}>
        {isExpanded ? "Show less" : "Show more"}
      </button>
    {/snippet}
  </PartialListDisclosure>
</PartialListDisclosure>
```
-->

<style>
  :global {
    @media (scripting: enabled) {
      .ds.partial-list-disclosure .hidden {
        display: none;
      }
    }

    @media (scripting: none) {
      .ds.partial-list-disclosure.toggle-button {
        display: none;
      }
    }
  }
</style>
