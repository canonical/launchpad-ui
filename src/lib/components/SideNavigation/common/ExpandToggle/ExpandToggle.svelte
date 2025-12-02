<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import { ExpandRightIcon } from "$lib/components/icons/index.js";
  import type { ExpandToggleProps } from "./types.js";

  const componentCssClassName = "ds side-navigation-expand-toggle";

  let { class: className, ...rest }: ExpandToggleProps = $props();
</script>

<ButtonPrimitive
  as="button"
  class={[componentCssClassName, className]}
  {...rest}
>
  <ExpandRightIcon class="expand-icon" />
</ButtonPrimitive>

<style>
  :global {
    .ds.side-navigation-expand-toggle {
      display: grid;
      place-items: center;
      box-sizing: content-box;

      &[aria-expanded="true"] {
        .expand-icon {
          transform: rotate(180deg);
        }
      }

      &[aria-expanded="false"] {
        /* When it's collapsed, make it look like navigation items */
        min-height: 1lh;
        --dimension-padding-block-button: var(
          --dimension-padding-block-side-navigation-item
        );
      }
    }
  }
</style>
