<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import type { RadioProps } from "./types.js";

  const componentCssClassName = "ds radio";

  let {
    class: className,
    group = $bindable(),
    onchange: onchangeProp,
    value,
    ...rest
  }: RadioProps<T> = $props();

  const onchange: typeof onchangeProp = (e) => {
    onchangeProp?.(e);
    if (value && (e.target as HTMLInputElement).checked) {
      group = value;
    }
  };
</script>

<input
  type="radio"
  class={[componentCssClassName, className]}
  {onchange}
  {value}
  checked={value !== undefined && group === value ? true : undefined}
  {...rest}
/>

<!-- @component
`Radio` is a input control for selecting a single option from a set.

As an input control, it requires a `<label>` associated with it.

## Example Usage
```svelte
<label>
  <Radio checked name="theme" value="light" />
  Light
</label>
<label>
  <Radio name="theme" value="dark" />
  Dark
</label>
```

## Group Control
The component supports `bind:group` for controlling a group of radios, similarly to [native Svelte bind:group](https://svelte.dev/docs/svelte/bind#input-bind:group).

If `bind:group` is used, the `checked` prop must be omitted, and each radio in the group must have a `value` prop set.

### Example Usage
```svelte
<script lang="ts">
  let theme = $state("light");
</script>

<label>
  <Radio bind:group={theme} value="light" />
  Light
</label>
<label>
  <Radio bind:group={theme} value="dark" />
  Dark
</label>
```
-->

<style>
  .ds.radio {
    --color-background-radio-hover: var(--lp-color-background-hover);
    --color-background-radio: var(--lp-color-background-default);
    --color-border-radio-checked-marker: var(--lp-color-text-link-default);
    --color-border-radio: var(--lp-color-border-high-contrast);
    /* Should it remain relative to the radio size? It is a unusual use of border If not: */
    /* TODO(@Enzo): Add missing token (5px). But to which sub-category? */
    --dimension-border-width-radio-checked-marker: calc(
      var(--dimension-size-radio) * 0.3125
    );
    --dimension-border-width-radio: var(--dimension-stroke-thickness-default);
    --dimension-radius-radio: var(--dimension-radius-full);
    --dimension-size-radio: var(--lp-dimension-size-xs);
    --opacity-radio-disabled: var(--lp-opacity-muted);

    position: relative;
    cursor: pointer;
    appearance: none;
    flex-grow: 0;
    flex-shrink: 0;
    outline-offset: 1px;

    width: var(--dimension-size-radio);
    height: var(--dimension-size-radio);
    border-radius: var(--dimension-radius-radio);
    border: var(--dimension-border-width-radio) solid var(--color-border-radio);
    background-color: var(--color-background-radio);
    transition: background-color var(--lp-transition-duration-brisk)
      var(--lp-transition-timing-ease-out);

    &::after {
      content: "";
      position: absolute;
      inset: calc(var(--dimension-border-width-radio) * -1);
      border-radius: var(--dimension-radius-radio);
      border: var(--dimension-border-width-radio-checked-marker) solid
        transparent;
      transition: border-color var(--lp-transition-duration-brisk)
        var(--lp-transition-timing-ease-out);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-radio-disabled);
    }

    &:hover:not(:disabled) {
      background-color: var(--color-background-radio-hover);
    }

    &:checked {
      &::after {
        border-color: var(--color-border-radio-checked-marker);
      }
    }
  }
</style>
