<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import type { CheckboxProps } from "./types.js";

  const componentCssClassName = "ds checkbox";

  let {
    class: className,
    group = $bindable(),
    checked = $bindable(),
    value,
    ...rest
  }: CheckboxProps<T> = $props();

  function getChecked() {
    if (group && value !== undefined) return group.includes(value);
    return Boolean(checked);
  }

  function setChecked(newChecked: boolean) {
    checked = newChecked;

    if (group && value !== undefined) {
      if (newChecked) {
        group = [...group, value];
      } else {
        group = group.filter((v) => v !== value);
      }
    }
  }
</script>

<input
  type="checkbox"
  class={[componentCssClassName, className]}
  {value}
  bind:checked={getChecked, setChecked}
  {...rest}
/>

<!-- @component
`Checkbox` is an input control for selecting one or more options.

As an input control, it requires a `<label>` associated with it.

## Example Usage
```svelte
<label>
  <Checkbox checked />
  Receive updates
</label>
```

## Group Control
The component supports `bind:group` for controlling a group of checkboxes, similarly to [native Svelte bind:group](https://svelte.dev/docs/svelte/bind#input-bind:group).

If `bind:group` is used, the `checked` prop must be omitted, and each checkbox in the group must have a `value` prop set. The bound `group` should be an array of values.

### Example Usage
```svelte
<script lang="ts">
  let selected = $state<string[]>([]);
</script>

<label>
  <Checkbox bind:group={selected} value="alpha" />
  Alpha
</label>
<label>
  <Checkbox bind:group={selected} value="beta" />
  Beta
</label>
```
-->

<style>
  .ds.checkbox {
    --color-background-checkbox-hover: var(--lp-color-background-hover);
    --color-background-checkbox: var(--lp-color-background-default);
    --color-background-checkbox-checked: var(--lp-color-text-link-default);
    --color-border-checkbox: var(--lp-color-border-high-contrast);
    --dimension-border-width-checkbox: var(
      --dimension-stroke-thickness-default
    );
    --dimension-size-checkbox: var(--lp-dimension-size-xs);
    --opacity-checkbox-disabled: var(--lp-opacity-muted);
    --color-checkbox-checked-marker: var(--lp-color-background-default);
    --dimension-inset-checkbox-checked-marker: calc(
      var(--dimension-size-checkbox) * 0.1
    );
    --clip-path-checkbox-checked-marker: polygon(
      2.86% 50%,
      38.21% 85.36%,
      97.14% 26.43%,
      85.36% 14.64%,
      38.21% 61.78%,
      14.64% 38.22%
    );
    --clip-path-checkbox-indeterminate-marker: inset(40% 0);

    position: relative;
    cursor: pointer;
    appearance: none;
    flex-grow: 0;
    flex-shrink: 0;
    outline-offset: 1px;

    width: var(--dimension-size-checkbox);
    height: var(--dimension-size-checkbox);
    border: var(--dimension-border-width-checkbox) solid
      var(--color-border-checkbox);
    background-color: var(--color-background-checkbox);
    transition:
      background-color var(--lp-transition-duration-brisk)
        var(--lp-transition-timing-ease-out),
      border-color var(--lp-transition-duration-brisk)
        var(--lp-transition-timing-ease-out);

    &:after {
      content: "";
      position: absolute;
      inset: var(--dimension-inset-checkbox-checked-marker);
      display: none;
      background-color: var(--color-checkbox-checked-marker);
    }

    &:checked {
      background-color: var(--color-background-checkbox-checked);
      border-color: var(--color-background-checkbox-checked);

      &:after {
        display: block;
        clip-path: var(--clip-path-checkbox-checked-marker);
      }
    }

    &:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-checkbox-disabled);
    }

    &:hover:not(:disabled):not(:checked):not(:indeterminate) {
      background-color: var(--color-background-checkbox-hover);
    }

    &:indeterminate {
      background-color: var(--color-background-checkbox-checked);
      border-color: var(--color-background-checkbox-checked);

      &:after {
        display: block;
        clip-path: var(--clip-path-checkbox-indeterminate-marker);
      }
    }
  }
</style>
