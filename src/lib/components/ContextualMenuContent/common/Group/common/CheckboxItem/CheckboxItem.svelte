<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { Checkbox } from "$lib/components/Checkbox/index.js";
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { CheckboxItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName =
    "ds contextual-menu-content-checkbox-item contextual-menu-content-item";

  let {
    id,
    class: className,
    style,
    checked = $bindable(),
    group = $bindable(),
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    ...rest
  }: CheckboxItemProps<T> = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<label
  {id}
  class={[componentCssClassName, className, { disabled }]}
  {style}
  data-testid="checkbox-item"
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
  <!-- In order to forward both group and checked, one of them has to be asserted as `undefined`, because we disallow using both of them at the same time via props type definition. When a prop is separated from `rest` to use it with with `bind` directive TypeScript cannot know which discriminated union's branch is hit. Even though props that are passed through as rest and bound deeper behave properly (which would allow us to skip `bind:*` on this level entirely), Svelte complains that all bindable props have to be decorated with `$bindable()` explicitly, which sadly doesn't seem to change anytime soon (see: https://github.com/sveltejs/svelte/issues/15127). -->
  <Checkbox bind:checked bind:group={group as undefined} {disabled} {...rest} />
</label>

<!-- @component
`ContextualMenuContent.CheckboxItem` renders a checkbox control.

Component supports group binding. See `Checkbox` for more details.

## Example Usage
```svelte
<ContextualMenuContent.CheckboxItem text="Show whitespace changes" bind:checked={showWhitespace} />
```
-->

<style>
  .ds.contextual-menu-content-checkbox-item {
    > :global(.ds.checkbox) {
      grid-area: checkable;
      margin-inline-end: var(
        --dimension-margin-end-contextual-menu-content-item-checkable
      );
    }
  }
</style>
