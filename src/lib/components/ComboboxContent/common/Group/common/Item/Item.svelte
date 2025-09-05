<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";
  import { getComboboxContext } from "$lib/components/ComboboxContent/context.js";
  import {
    CheckboxOption,
    RadioOption,
  } from "$lib/components/Options/index.js";
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import type { ItemProps } from "./types.js";

  let {
    id: idProp,
    checked,
    style,
    onchange: onchangeProp,
    ...rest
  }: ItemProps = $props();

  const comboboxContext = getComboboxContext();

  const fallbackId = $props.id();
  const id = $derived(idProp || fallbackId);

  const onchange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onchangeProp?.(e);
    checked = (e.target as HTMLInputElement).checked;
  };

  const isMounted = useIsMounted();

  const itemProps = $derived({
    id,
    checked,
    onchange,
    ...(isMounted.value && {
      role: "option",
      "aria-selected": Boolean(checked),
      tabindex: -1,
    }),
    ...rest,
  });

  const activeStyle = $derived(
    id === comboboxContext?.activeDescendant
      ? "outline: var(--dimension-stroke-thickness-large) solid var(--tmp-color-border-focus); outline-offset: calc(var(--dimension-stroke-thickness-large) * -1);"
      : undefined,
  );
</script>

{#if comboboxContext?.type === "single"}
  <RadioOption {...itemProps} style="{activeStyle} {style}" />
{:else}
  <CheckboxOption {...itemProps} style="{activeStyle} {style}" />
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
