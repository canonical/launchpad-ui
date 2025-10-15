<!-- @canonical/generator-ds 0.10.0-experimental.4 -->

<script lang="ts">
  import type { TextInputPrimitiveProps } from "./types.js";

  let {
    value = $bindable(),
    ref = $bindable(),
    type = "text",
    ...rest
  }: TextInputPrimitiveProps = $props();
</script>

<input {type} bind:value bind:this={ref} {...rest} />

<style>
  /* Do not use classes to keep the specificity as low as possible - (0, 1, 1) with scoping, so that the direct wrappers (e.g. TextInput) with unscoped styles and `.ds.class` (0, 2, 0) selectors can override these styles */
  input {
    --color-background-text-input-active: var(--tmp-color-background-input);
    --color-background-text-input-hover: var(--tmp-color-background-input);
    --color-background-text-input: var(--tmp-color-background-input);
    --dimension-padding-inline-text-input: var(
      --tmp-dimension-spacing-inline-m
    );
    --dimension-padding-block-text-input: var(
      --tmp-dimension-spacing-block-xxs
    );
    --color-border-text-input: var(--tmp-color-border-high-contrast);
    --border-style-text-input: none none solid none;
    --dimension-border-width-text-input: var(
      --dimension-stroke-thickness-default
    );
    --color-outline-text-input: var(--tmp-color-border-focus);
    --color-text-text-input: var(--tmp-color-text-default);
    --color-text-text-input-placeholder: var(--tmp-color-text-muted);
    --typography-text-input: var(--tmp-typography-paragraph-default);
    --opacity-text-input-disabled: var(--tmp-opacity-muted);
    --color-background-text-input-invalid: var(
      --tmp-color-background-negative-default
    );
    --color-border-text-input-invalid: var(--tmp-color-border-negative);
    --color-outline-text-input-invalid: var(--tmp-color-border-negative);

    padding-inline: var(--dimension-padding-inline-text-input);
    padding-block: var(--dimension-padding-block-text-input);
    border-width: var(--dimension-border-width-text-input);
    border-style: var(--border-style-text-input);
    border-color: var(--color-border-text-input);
    outline-color: var(--color-outline-text-input);
    background-color: var(--color-background-text-input);
    color: var(--color-text-text-input);
    font: var(--typography-text-input);
    transition-duration: var(--tmp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--tmp-transition-timing-ease-in);

    &::placeholder {
      color: var(--color-text-text-input-placeholder);
    }

    &:hover {
      background-color: var(--color-background-text-input-hover);
    }

    &:active {
      background-color: var(--color-background-text-input-active);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-text-input-disabled);
    }

    &:invalid {
      background-color: var(--color-background-text-input-invalid);
      border-color: var(--color-border-text-input-invalid);
      outline-color: var(--color-outline-text-input-invalid);
    }
  }
</style>
