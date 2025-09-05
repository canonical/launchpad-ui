<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { getComboboxContext } from "$lib/components/ComboboxContent/context.js";
  import {
    CheckboxOption,
    RadioOption,
  } from "$lib/components/Options/index.js";
  import type { ItemProps } from "./types.js";

  const props: ItemProps = $props();

  const comboboxContentContext = getComboboxContext();
</script>

{#if comboboxContentContext?.type === "single"}
  <RadioOption {...props} />
{:else}
  <CheckboxOption {...props} />
{/if}

<!-- @component
`Item` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<Item class="custom-class" id="unique-id">
  <p>Content goes here</p>
</Item>
```
-->
