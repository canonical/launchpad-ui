<!-- @canonical/generator-ds 0.10.0-experimental.4 -->

<script lang="ts">
  import type { InputPrimitiveProps } from "./types.js";

  let {
    value = $bindable(),
    ref = $bindable(),
    type = "text",
    ...rest
  }: InputPrimitiveProps = $props();
</script>

<input {type} bind:value bind:this={ref} {...rest} />

<style>
  /* Do not use classes to keep the specificity as low as possible - (0, 1, 1) with scoping, so that the direct wrappers (e.g. TextInput) with unscoped styles and `.ds.class` (0, 2, 0) selectors can override these styles */
  input {
    --color-background-text-input-active: var(--lp-color-background-active);
    --color-background-text-input-hover: var(--lp-color-background-hover);
    --color-background-text-input: var(--lp-color-background-input);
    --dimension-padding-inline-text-input: var(--lp-dimension-spacing-inline-m);
    --dimension-padding-block-text-input: var(--lp-dimension-spacing-block-xxs);
    --color-border-text-input: var(--lp-color-border-high-contrast);
    --border-style-text-input: none none solid none;
    --dimension-border-width-text-input: var(
      --dimension-stroke-thickness-default
    );
    --color-outline-text-input: var(--lp-color-border-focus);
    --color-text-text-input: var(--lp-color-text-default);
    --color-text-text-input-placeholder: var(--lp-color-text-muted);
    --typography-text-input: var(--lp-typography-paragraph-default);
    --opacity-text-input-disabled: var(--lp-opacity-muted);
    --color-background-text-input-invalid: var(
      --lp-color-background-negative-default
    );
    --color-background-text-input-invalid-hover: var(
      --lp-color-background-negative-hover
    );
    --color-background-text-input-invalid-active: var(
      --lp-color-background-negative-active
    );
    --color-border-text-input-invalid: var(--lp-color-border-negative);
    --color-outline-text-input-invalid: var(--lp-color-border-negative);

    padding-inline: var(--dimension-padding-inline-text-input);
    padding-block: var(--dimension-padding-block-text-input);
    border-width: var(--dimension-border-width-text-input);
    border-style: var(--border-style-text-input);
    border-color: var(--color-border-text-input);
    outline-color: var(--color-outline-text-input);
    background-color: var(--color-background-text-input);
    color: var(--color-text-text-input);
    font: var(--typography-text-input);
    transition-duration: var(--lp-transition-duration-snap);
    transition-property: background-color, border-color;
    transition-timing-function: var(--lp-transition-timing-ease-in);

    &::placeholder {
      color: var(--color-text-text-input-placeholder);
    }

    &:hover {
      background-color: var(--color-background-text-input-hover);
    }

    &:active,
    &:focus {
      background-color: var(--color-background-text-input-active);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: var(--opacity-text-input-disabled);
    }

    &:user-invalid,
    &[aria-invalid="true"] {
      background-color: var(--color-background-text-input-invalid);
      border-color: var(--color-border-text-input-invalid);
      outline-color: var(--color-outline-text-input-invalid);
      &:hover {
        background-color: var(--color-background-text-input-invalid-hover);
      }
      &:active,
      &:focus {
        background-color: var(--color-background-text-input-invalid-active);
      }
    }
  }
</style>
