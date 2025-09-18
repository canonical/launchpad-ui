<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionsPanel } from "$lib/components/common/index.js";
  import type { ContextualMenuProps } from "./types.js";

  const props: ContextualMenuProps = $props();
</script>

<OptionsPanel {...props} />

<!-- @component
`ContextualMenuContent` is the container for contextual menu groups and items. It renders its children and an optional helper footer used to provide additional context for the menu.

## Example Usage
```svelte
<ContextualMenuContent>
  <ContextualMenuContent.Group groupTitle="Preferences">
    <ContextualMenuContent.CheckboxItem text="Show whitespace" />
  </ContextualMenuContent.Group>

  {#snippet helper(id)}
    <ContextualMenuContent.Helper {id}>
      Use the options above to customize the view
    </ContextualMenuContent.Helper>
  {/snippet}
</ContextualMenuContent>
```
-->
