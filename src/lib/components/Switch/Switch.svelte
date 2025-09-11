<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts" generics="T">
  import { useIsMounted } from "$lib/useIsMounted.svelte.js";
  import type { SwitchProps } from "./types.js";

  const componentCssClassName = "ds switch";

  let {
    class: className,
    group = $bindable(),
    checked: checkedProp = $bindable(),
    onchange: onchangeProp,
    value,
    disabled,
    ...rest
  }: SwitchProps<T> = $props();

  const onchange: typeof onchangeProp = (e) => {
    onchangeProp?.(e);
    const newChecked = (e.target as HTMLInputElement).checked;
    checkedProp = newChecked;
    if (value && group) {
      if (newChecked) {
        // Don't use push, because if the passed group is not bound, it would mutate not owned state
        group = [...group, value];
      } else {
        // Don't use splice for the same reason
        group = group.filter((v) => v !== value);
      }
    }
  };

  const checked = $derived(
    value !== undefined && group?.includes(value) ? true : checkedProp,
  );

  const isMounted = useIsMounted();
  // If there is no JS, we have no way to update the `aria-checked` attribute even though, the checkbox remains functional. Don't set `aria-checked` server-side, to avoid mismatched `checked` and `aria-checked` states.
  const ariaChecked = $derived(isMounted.value ? Boolean(checked) : undefined);
</script>

<input
  type="checkbox"
  role="switch"
  class={[componentCssClassName, className]}
  {onchange}
  {value}
  {disabled}
  {checked}
  aria-checked={ariaChecked}
  aria-readonly={disabled}
  {...rest}
/>

<!-- @component
`Switch` is a toggle control that allows users to switch between two states, typically on and off. It is commonly used for settings or preferences.

As an input control, it requires a `<label>` associated with it.

## Example Usage
```svelte
<script lang="ts">
  let checked = $state(false);
</script>
<label>
  <Switch bind:checked />
  Toggle me
</label>
```

## Group Control
The component supports `bind:group` for controlling a group of switches, similarly to [native Svelte bind:group](https://svelte.dev/docs/svelte/bind#input-bind:group) of checkbox inputs.

If `bind:group` is used, the `checked` prop must be omitted, and each switch in the group must have a `value` prop set. The bound `group` should be an array of values.

The presence of a Switch's `value` in the `group` array determines (and is reflected by) its checked state.

### Example Usage
```svelte
<script lang="ts">
  let selected = $state<string[]>([]);
</script>

<label>
  <Switch bind:group={selected} value="alpha" />
  Alpha
</label>
<label>
  <Switch bind:group={selected} value="beta" />
  Beta
</label>
```
-->

<style>
  .ds.switch {
    --color-background-switch: var(--tmp-color-border-high-contrast);
    --color-background-switch-checked: var(--tmp-color-text-link-default);
    --color-background-switch-knob: var(--tmp-color-background-default);
    --opacity-switch-disabled: var(--tmp-opacity-muted);
    --dimension-radius-switch: var(--dimension-radius-full);
    --dimension-width-switch: var(--tmp-dimension-size-l);
    --dimension-height-switch: var(--tmp-dimension-size-xs);
    --dimension-padding-switch: var(--dimension-stroke-thickness-default);

    appearance: none;
    position: relative;
    cursor: pointer;
    outline-offset: 0;

    width: var(--dimension-width-switch);
    height: var(--dimension-height-switch);
    background-color: var(--color-background-switch);
    border-radius: var(--dimension-radius-switch);

    &::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: var(--dimension-height-switch);
      height: var(--dimension-height-switch);
      background-color: var(--color-background-switch-knob);
      border-radius: var(--dimension-radius-switch);
      border: var(--dimension-padding-switch) solid
        var(--color-background-switch);
      transition: transform var(--tmp-transition-duration-slow)
        var(--tmp-transition-timing-ease-out);
    }

    &:checked {
      background-color: var(--color-background-switch-checked);

      &::after {
        border-color: var(--color-background-switch-checked);
        transform: translate(calc(var(--dimension-width-switch) / 2), -50%);
      }
    }

    &:disabled {
      opacity: var(--opacity-switch-disabled);
      cursor: not-allowed;
    }
  }
</style>
