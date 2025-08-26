<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { Radio } from "$lib/components/Radio/index.js";
  import { getGroupContext } from "../../context.js";
  import { ItemContent } from "../common/index.js";
  import type { RadioItemProps } from "./types.js";
  import "../item.css";

  const componentCssClassName =
    "ds contextual-menu-content-radio-item contextual-menu-content-item";

  let {
    id,
    class: className,
    group = $bindable(),
    style,
    text,
    icon,
    secondaryText,
    trailingText,
    disabled: disabledProp,
    ...rest
  }: RadioItemProps<T> = $props();

  const groupContext = getGroupContext();
  const disabled = $derived(groupContext?.disabled || disabledProp);
</script>

<label
  {id}
  class={[componentCssClassName, className, { disabled }]}
  {style}
  data-testid="radio-item"
>
  <ItemContent {text} {icon} {secondaryText} {trailingText} />
  <!-- In order to forward both group and checked, one of them has to be asserted as `undefined`, because we disallow using both of them at the same time via props type definition. When a prop is separated from `rest` to use it with with `bind` directive TypeScript cannot know which discriminated union's branch is hit. Even though props that are passed through as rest and bound deeper behave properly (which would allow us to skip `bind:*` on this level entirely), Svelte complains that all bindable props have to be decorated with `$bindable()` explicitly, which sadly doesn't seem to change anytime soon (see: https://github.com/sveltejs/svelte/issues/15127). -->
  <Radio bind:group={group as undefined} {disabled} {...rest} />
</label>

<!-- @component
`ContextualMenuContent.RadioItem` renders a radio control.

Component supports group binding. See `Radio` for more details.

## Example Usage
```svelte
<ContextualMenuContent.RadioItem name="layout" value="inline" text="Inline" checked />
<ContextualMenuContent.RadioItem name="layout" value="side-by-side" text="Side-by-side" />
```
-->

<style>
  .ds.contextual-menu-content-radio-item {
    > :global(.ds.radio) {
      grid-area: checkable;
      margin-inline-end: var(
        --dimension-margin-end-contextual-menu-content-item-checkable
      );
    }
  }
</style>
