<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { TextareaProps } from "./types.js";
  import { calculateDynamicRows } from "./utils/index.js";

  const componentCssClassName = "ds textarea";
  // source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/textarea#rows
  const defaultRows = 2;

  let {
    class: className,
    value = $bindable(),
    ref = $bindable(),
    rows: rowsProps = [defaultRows, defaultRows * 2 + 1],
    ...rest
  }: TextareaProps = $props();
  const dynamicRows = $derived.by(() => {
    if (typeof rowsProps === "number") {
      return rowsProps;
    }

    if (!value) {
      return rowsProps[0];
    }

    const [minRows, maxRows] = rowsProps;
    return calculateDynamicRows(value, minRows, maxRows);
  });
</script>

<textarea
  bind:this={ref}
  bind:value
  class={[componentCssClassName, className]}
  rows={dynamicRows}
  {...rest}
></textarea>

<!-- @component
`Textarea` is a reusable UI component that renders a native `<textarea>` element, supporting all standard textarea attributes and two-way binding for its value.

## Example Usage
```svelte
<Textarea bind:value={value} />
```
-->

<style>
  .ds.textarea {
    --color-background-textarea-input-active: var(--tmp-color-background-input);
    --color-background-textarea-input-hover: var(--tmp-color-background-input);
    --color-background-textarea-input: var(--tmp-color-background-input);
    --dimension-padding-inline-textarea-input: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-textarea-input: var(
      --tmp-dimension-spacing-block-xxs
    );
    --color-border-textarea-input: var(--tmp-color-border-high-contrast);
    --border-style-textarea-input: none none solid none;
    --dimension-border-width-textarea-input: var(
      --dimension-stroke-thickness-default
    );
    --color-text-textarea-input: var(--tmp-color-text-default);
    --color-text-textarea-input-placeholder: var(--tmp-color-text-muted);
    --typography-textarea-input: var(--tmp-typography-paragraph-default);
    --opacity-textarea-input-disabled: var(--tmp-opacity-muted);
    --color-background-textarea-input-invalid: var(
      --tmp-color-background-negative-default
    );
    --color-border-textarea-input-invalid: var(--tmp-color-border-negative);
    --color-outline-textarea-input-invalid: var(--tmp-color-border-negative);

    background-color: var(--color-background-textarea-input);
    border-color: var(--color-border-textarea-input);
    border-style: var(--border-style-textarea-input);
    border-width: var(--dimension-border-width-textarea-input);
    color: var(--color-text-textarea-input);
    font: var(--typography-textarea-input);
    padding-block: var(--dimension-padding-block-textarea-input);
    padding-inline: var(--dimension-padding-inline-textarea-input);
    transition-duration: var(--tmp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--tmp-transition-timing-ease-in);

    &::placeholder {
      color: var(--color-text-textarea-input-placeholder);
    }

    &:hover {
      background-color: var(--color-background-textarea-input-hover);
    }

    &:active {
      background-color: var(--color-background-textarea-input-active);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-textarea-input-disabled);
    }

    &:invalid {
      background-color: var(--color-background-textarea-input-invalid);
      border-color: var(--color-border-textarea-input-invalid);
      outline-color: var(--color-outline-textarea-input-invalid);
    }
  }
</style>
