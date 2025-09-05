<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionsGroup } from "$lib/components/common/index.js";
  import type { GroupProps } from "./types.js";

  const props: GroupProps = $props();
</script>

<OptionsGroup {...props} />

<!-- @component
`ContextualMenuContent.Group` [FIXME] groups related menu items under an optional title. Can disable all nested items via the `disabled` prop.

## Example Usage
```svelte
<ContextualMenuContent.Group groupTitle="Diff layout">
  <ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" />
  <ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
</ContextualMenuContent.Group>
```
-->
