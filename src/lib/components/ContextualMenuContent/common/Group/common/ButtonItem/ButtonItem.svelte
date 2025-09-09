<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { ButtonOption } from "$lib/components/common/index.js";
  import { getGroupContext } from "../../context.js";
  import type { ButtonItemProps } from "./types.js";

  let { disabled: disabledProp, ...rest }: ButtonItemProps = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<ButtonOption {disabled} {...rest} />

<!-- @component
`ContextualMenuContent.ButtonItem` renders a button-style menu action.

## Example Usage
```svelte
<ContextualMenuContent.ButtonItem text="Reset to default" onclick={resetToDefault} />
```
-->
