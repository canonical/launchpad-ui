<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts" generics="T">
  import { modifiersValues } from "$lib/modifiers/utils.js";
  import { Icon } from "../Icon/index.js";
  import type { SelectProps } from "./types.js";

  const componentCssClassName = "ds select";
  const componentCssClassNameContainer = "ds select-container";

  let {
    class: className,
    ref = $bindable(),
    value = $bindable(),
    children,
    modifiers,
    ...rest
  }: SelectProps<T> = $props();
</script>

<div
  class={[
    componentCssClassNameContainer,
    modifiersValues(modifiers),
    rest.multiple === true && "multiple",
  ]}
>
  <select
    class={[componentCssClassName, className]}
    bind:value
    bind:this={ref}
    {...rest}
  >
    {@render children?.()}
  </select>
  <Icon name="chevron-down" />
</div>

<!-- @component
`Select` a native `<select>` element with styles.

## Example Usage
```svelte
<Select bind:value={valueState}>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
  <option value="3">Option 3</option>
</Select>
```
-->

<style>
  .ds.select-container {
    --color-background-select-input-active: var(
      --tmp-color-background-secondary-active-context,
      var(--tmp-color-background-input)
    );
    --color-background-select-input-hover: var(
      --tmp-color-background-secondary-hover-context,
      var(--tmp-color-background-input)
    );
    --color-background-select-input: var(
      --tmp-color-background-secondary-context,
      var(--tmp-color-background-input)
    );
    --color-background-select-input-invalid: var(
      --tmp-color-background-negative-default
    );

    --dimension-padding-inline-select-input: var(
      --dimension-padding-inline-context,
      var(--tmp-dimension-spacing-inline-xs)
    );

    --dimension-padding-block-select-input: var(
      --dimension-padding-block-context,
      var(--tmp-dimension-spacing-block-xxs)
    );
    --color-border-select-input: var(
      --tmp-color-border-secondary-context,
      var(--tmp-color-border-high-contrast)
    );
    --color-outline-select-input: var(
      --tmp-color-border-secondary-context,
      var(--tmp-color-border-focus)
    );
    --color-border-select-input-invalid: var(--tmp-color-border-negative);
    --color-outline-select-input-invalid: var(--tmp-color-border-negative);

    --border-style-select-input: none none solid none;
    --dimension-border-width-select-input: var(
      --dimension-stroke-thickness-default
    );

    --color-text-select-input: var(--tmp-color-text-default);
    --color-text-select-input-placeholder: var(--tmp-color-text-muted);
    --typography-select-input: var(--tmp-typography-paragraph-default);
    --dimension-gap-select-input: var(--tmp-dimension-spacing-inline-xxxs);
    --dimension-icon-size-select-input: var(--tmp-dimension-size-xs);
    --dimension-padding-block-select-input-option: var(
      --dimension-padding-block-select-input
    );

    grid-template-columns: repeat(1, minmax(0, 1fr));
    display: inline-grid;

    color: var(--color-text-select-input);
    font: var(--typography-select-input);

    > .ds.select {
      appearance: none;
      background-color: transparent;
      border: none;
      color: var(--color-text-select-input);
      font: var(--typography-select-input);

      padding-inline-start: var(--dimension-padding-inline-select-input);
      padding-inline-end: calc(
        var(--dimension-padding-inline-select-input) +
          var(--dimension-gap-select-input) +
          var(--dimension-icon-size-select-input)
      );
      padding-block: var(--dimension-padding-block-select-input);
      border-color: var(--color-border-select-input);
      border-style: var(--border-style-select-input);
      border-width: var(--dimension-border-width-select-input);
      background-color: var(--color-background-select-input);

      transition-duration: var(--tmp-transition-duration-snap);
      transition-property: background-color, border-color;
      transition-timing-function: var(--tmp-transition-timing-ease-in);

      grid-row-start: 1;
      grid-column-start: 1;

      &:hover {
        background-color: var(--color-background-select-input-hover);
      }

      &::placeholder {
        color: var(--color-text-select-input-placeholder);
      }

      &:active {
        background-color: var(--color-background-select-input-active);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: var(--opacity-select-input-disabled);
      }

      &:invalid {
        background-color: var(--color-background-select-input-invalid);
        border-color: var(--color-border-select-input-invalid);
        outline-color: var(--color-outline-select-input-invalid);
      }
    }

    > :global(.ds.icon) {
      --dimension-size-icon: var(--dimension-icon-size-select-input);
      justify-self: flex-end;
      align-self: center;
      margin-block: var(--dimension-padding-block-select-input);

      pointer-events: none;
      margin-inline-end: var(--dimension-padding-inline-select-input);

      grid-row-start: 1;
      grid-column-start: 1;
    }

    &.multiple {
      > :global(.ds.icon) {
        align-self: start;
        margin-block-start: calc(
          (
            (
                1lh + 2 * var(--dimension-padding-block-select-input) -
                  var(--dimension-icon-size-select-input)
              ) /
              2
          )
        );
      }
      > .ds.select :global(option) {
        padding-block: var(--dimension-padding-block-select-input-option);
      }
    }
  }
</style>
