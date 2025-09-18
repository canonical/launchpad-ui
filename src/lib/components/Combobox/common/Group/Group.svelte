<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import { OptionsGroup } from "$lib/components/common/index.js";
  import type { GroupProps } from "./types.js";

  const props: GroupProps = $props();
</script>

<OptionsGroup {...props} />

<!-- @component
`Combobox.Group` allows grouping of related options within the Combobox.

## Example Usage
```svelte
<Combobox.Group groupTitle="Diff layout">
  <Combobox.RadioItem name="layout" value="inline" text="Inline" />
  <Combobox.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
</Combobox.Group>
```
-->
