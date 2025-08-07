<!-- @canonical/generator-ds 0.10.0-experimental.0 -->

<script lang="ts">
  import type { SwitchProps } from "./types.js";

  const componentCssClassName = "ds switch";

  let {
    class: className,
    checked = $bindable(false),
    disabled,
    ...rest
  }: SwitchProps = $props();
</script>

<input
  type="checkbox"
  role="switch"
  class={[componentCssClassName, className]}
  bind:checked
  {disabled}
  aria-checked={checked}
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
      /* TODO: Replace with transition tokens when available */
      transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
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
