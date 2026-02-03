<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ChevronDownIcon } from "@canonical/svelte-icons";
  import type { SelectProps } from "./types.js";

  const componentCssClassName = "ds select";

  let {
    class: className,
    ref = $bindable(),
    value = $bindable(),
    children,
    severity,
    density,
    ...rest
  }: SelectProps = $props();
</script>

<div
  class={[componentCssClassName, className, severity, density]}
  data-testid="select"
>
  <select bind:value bind:this={ref} {...rest}>
    {@render children?.()}
  </select>
  {#if !rest.multiple}
    <ChevronDownIcon class="chevron" />
  {/if}
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
  .ds.select {
    --color-background-select-input-hover: var(
      --lp-color-background-secondary-hover-context,
      var(--lp-color-background-hover)
    );
    --color-background-select-input-active: var(
      --color-background-select-input-hover
    );
    --color-background-select-input: var(
      --lp-color-background-secondary-context,
      var(--lp-color-background-input)
    );

    --color-background-select-input-invalid: var(
      --lp-color-background-negative-default
    );
    --color-background-select-input-invalid-hover: var(
      --lp-color-background-negative-hover
    );
    --color-background-select-input-invalid-active: var(
      --lp-color-background-negative-active
    );

    --opacity-select-input-disabled: var(--lp-opacity-muted);

    --dimension-padding-inline-select-input: var(
      --lp-dimension-spacing-inline-xs
    );
    --dimension-padding-block-select-input: var(
      --dimension-padding-block-context,
      var(--lp-dimension-spacing-block-xxs)
    );

    --color-border-select-input: var(
      --lp-color-border-secondary-context,
      var(--lp-color-border-high-contrast)
    );
    --color-outline-select-input: var(
      --lp-color-border-secondary-context,
      var(--lp-color-border-focus)
    );
    --border-style-select-input: none none solid none;
    --dimension-border-width-select-input: var(
      --dimension-stroke-thickness-default
    );
    --color-border-select-input-invalid: var(--lp-color-border-negative);
    --color-outline-select-input-invalid: var(--lp-color-border-negative);

    --color-text-select-input: var(--lp-color-text-default);
    --color-text-select-input-placeholder: var(--lp-color-text-muted);
    --typography-select-input: var(--lp-typography-paragraph-default);

    --dimension-gap-select-input: var(--lp-dimension-spacing-inline-xxxs);

    --dimension-radius-select-input: var(--dimension-radius-small);

    --dimension-icon-size-select-input: var(--lp-dimension-size-xs);

    grid-template-columns: 1fr;
    display: inline-grid;

    color: var(--color-text-select-input);
    font: var(--typography-select-input);

    > select {
      appearance: none;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: var(--color-text-select-input);
      font: var(--typography-select-input);
      border-radius: var(--dimension-radius-select-input);

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

      transition-duration: var(--lp-transition-duration-snap);
      transition-property: background-color, border-color;
      transition-timing-function: var(--lp-transition-timing-ease-in);

      grid-row-start: 1;
      grid-column-start: 1;

      &:hover {
        background-color: var(--color-background-select-input-hover);
      }

      &:active,
      &:focus {
        background-color: var(--color-background-select-input-active);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: var(--opacity-select-input-disabled);
      }

      &:invalid,
      &[aria-invalid="true"] {
        background-color: var(--color-background-select-input-invalid);
        border-color: var(--color-border-select-input-invalid);
        outline-color: var(--color-outline-select-input-invalid);

        &:hover {
          background-color: var(--color-background-select-input-invalid-hover);
        }

        &:active,
        &:focus {
          background-color: var(--color-background-select-input-invalid-active);
        }
      }
    }

    > :global(.chevron) {
      --dimension-size-icon: var(--dimension-icon-size-select-input);
      justify-self: end;
      align-self: center;
      margin-block: var(--dimension-padding-block-select-input);

      pointer-events: none;
      margin-inline-end: var(--dimension-padding-inline-select-input);

      grid-row-start: 1;
      grid-column-start: 1;
    }

    > select[multiple] {
      :global(option) {
        --dimension-padding-block-select-input-option: var(
          --dimension-padding-block-select-input
        );
        --color-background-select-input-option-selected: var(
          --lp-color-background-secondary-active-context,
          var(--lp-color-background-active)
        );

        padding-block: var(--dimension-padding-block-select-input-option);
        background-color: transparent;

        &:checked {
          background-color: var(
            --color-background-select-input-option-selected
          );
        }
      }
    }

    > select[disabled] + :global(.chevron) {
      opacity: var(--opacity-select-input-disabled);
    }
  }
</style>
