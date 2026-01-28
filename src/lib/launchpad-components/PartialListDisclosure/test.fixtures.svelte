<script lang="ts" module>
  import type {
    HiddenItemProps,
    ListProps,
    ToggleButtonProps,
  } from "./types.js";

  const visibleItemText = "Visible item";
  const hiddenItemText = "Hidden item";

  export { children, hiddenItemText, visibleItemText };
</script>

{#snippet children(
  listProps: ListProps,
  hiddenItemProps: HiddenItemProps,
  toggleButtonProps: ToggleButtonProps,
  isExpanded: boolean,
)}
  <ul {...listProps}>
    <li>{visibleItemText}</li>
    <li {...hiddenItemProps}>{hiddenItemText}</li>
  </ul>
  <button {...toggleButtonProps}>
    {isExpanded ? "Show less" : "Show more"}
  </button>
{/snippet}
