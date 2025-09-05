<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import { OptionsPanel } from "../Options/index.js";
  import { setComboboxContext } from "./context.js";
  import type { ComboboxContentProps } from "./types.js";

  let { type = "multi", ...rest }: ComboboxContentProps = $props();

  setComboboxContext({
    get type() {
      return type;
    },
  });
</script>

<OptionsPanel {...rest} />

<!-- @component
`ComboboxContent` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ComboboxContent class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ComboboxContent>
```
-->
