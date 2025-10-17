<!-- @canonical/generator-ds 0.10.0-experimental.4 -->

<script lang="ts">
  import { Icon } from "$lib/components/Icon/index.js";
  import {
    ButtonPrimitive,
    TextInputPrimitive,
  } from "$lib/components/common/index.js";
  import type { SearchBoxProps } from "./types.js";

  const componentCssClassName = "ds search-box";

  let {
    class: className,
    value = $bindable(),
    "aria-label": ariaLabel,
    onclick,
    disabled,
    invalidStyled,
    ...rest
  }: SearchBoxProps = $props();
</script>

<div class={[componentCssClassName, className]} data-testid="search-box">
  <TextInputPrimitive
    type="search"
    bind:value
    aria-label={ariaLabel}
    {disabled}
    class={{ "no-invalid-styles": !invalidStyled }}
    {...rest}
  />
  <ButtonPrimitive
    as="button"
    type="submit"
    aria-label={ariaLabel}
    {disabled}
    {onclick}
  >
    <Icon name="search" />
  </ButtonPrimitive>
</div>

<!-- @component
`SearchBox` is a text input field designed for search functionality. It includes a text input and a submit button.

If the `SearchBox` is used within a form, it will be submitted when the button is clicked or when the user presses the Enter key while focused on the input. If not used within a form, you can provide an `onclick` handler to define custom behavior for the button interaction or `onkeydown` on the input for handling Enter key presses.

## Example Usage
### Basic Example
```svelte
<SearchBox aria-label="Search articles" placeholder="Ubuntu" onclick={handleClick} onkeydown={handleKeyDown} />
```

### As a search landmark
To make the `SearchBox` a search landmark wrap it in a [`<form role="search">`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/search_role) or [`<search>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search)
```svelte
<search>
  <form>
    <SearchBox aria-label="Articles" name="q" />
  </form>
</search>
```
-->

<style>
  .ds.search-box {
    --dimension-width-search-box-button: var(--tmp-dimension-size-l);
    --dimension-gap-search-box: var(--tmp-dimension-spacing-inline-xs);

    display: grid;
    grid-template-areas: "main";

    :global {
      > * {
        grid-area: main;
      }

      > input {
        padding-inline-end: calc(
          2 * var(--dimension-gap-search-box) +
            var(--dimension-width-search-box-button)
        );

        &::-webkit-search-cancel-button {
          display: none;
        }

        &.no-invalid-styles {
          --color-background-text-input-invalid: var(
            --color-background-text-input
          );
          --color-background-text-input-invalid-hover: var(
            --color-background-text-input-hover
          );
          --color-background-text-input-invalid-active: var(
            --color-background-text-input-active
          );
          --color-border-text-input-invalid: var(--color-border-text-input);
          --color-outline-text-input-invalid: var(--color-outline-text-input);
        }
      }

      > button {
        justify-self: end;
        display: grid;
        place-items: center;
        --color-background-button-hover: transparent;
        --color-background-button-active: transparent;
        --dimension-padding-block-button: 0;
        --dimension-padding-inline-button: 0;

        width: var(--dimension-width-search-box-button);
        margin-inline-end: var(--dimension-gap-search-box);
      }
    }
  }
</style>
