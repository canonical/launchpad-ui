<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import type { ExpandToggleProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds side-navigation-expand-toggle";

  let { class: className, ...rest }: ExpandToggleProps = $props();
</script>

<ButtonPrimitive
  as="button"
  class={[componentCssClassName, className]}
  {...rest}
>
  <Icon name="expand-right" class="expand-icon" />
</ButtonPrimitive>

<!-- @component
`ExpandToggle` [FIXME] (placeholder) A reusable UI component that renders content in a div container.

## Example Usage
```svelte
<ExpandToggle class="custom-class" id="unique-id">
  <p>Content goes here</p>
</ExpandToggle>
```
-->
