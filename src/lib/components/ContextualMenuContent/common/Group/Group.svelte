<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionsGroup } from "$lib/components/common/index.js";
  import { setGroupContext } from "./context.js";
  import type { GroupProps } from "./types.js";

  let { disabled = false, ...rest }: GroupProps = $props();

  setGroupContext({
    get disabled() {
      return Boolean(disabled);
    },
  });
</script>

<OptionsGroup {disabled} {...rest} />

<!-- @component
`ContextualMenuContent.Group` groups related menu items under an optional title. Can disable all nested items via the `disabled` prop.

## Example Usage
```svelte
<ContextualMenuContent.Group groupTitle="Diff layout">
  <ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" />
  <ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
</ContextualMenuContent.Group>
```
-->
