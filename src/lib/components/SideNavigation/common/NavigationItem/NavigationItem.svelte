<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import type { NavigationItemProps } from "./types.js";

  const componentCssClassName = "ds navigation-item";

  let {
    class: className,
    children,
    icon,
    selected,
    ...rest
  }: NavigationItemProps = $props();

  const labelId = $props.id();
</script>

<ButtonPrimitive
  class={[componentCssClassName, className, { selected }]}
  aria-labelledby={labelId}
  {...rest}
>
  {#if icon}
    <div class="icon">
      {@render icon()}
    </div>
  {/if}
  <!-- using labeled-by exposes the contents to a11y tree even if the label is visually hidden -->
  <div id={labelId} class="label">
    {@render children()}
  </div>
</ButtonPrimitive>

<style>
  :global {
    .ds.navigation-item {
      display: grid;
      position: relative;
      grid-column: 1 / -1;

      --dimension-padding-inline-button: 0;
      --dimension-padding-block-button: var(--lp-dimension-spacing-block-xxs);
      --dimension-padding-inline-start-button-label: var(
        --lp-dimension-spacing-inline-xs
      );
      --color-background-button-selected: var(
        --lp-color-background-neutral-active
      );
      --dimension-width-button-selected-indicator: var(
        --dimension-stroke-thickness-large
      );
      --color-background-button-selected-indicator: var(
        --lp-color-border-highlight
      );

      grid-template-columns: subgrid;

      > .icon {
        grid-column: logo;
        place-self: center;
      }

      > .label {
        grid-column: expanded-start / content-end;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-inline-start: var(
          --dimension-padding-inline-start-button-label
        );
      }

      &.selected {
        --color-background-button: var(--color-background-button-selected);
        --color-background-button-hover: var(
          --color-background-button-selected
        );
        --color-background-button-active: var(
          --color-background-button-selected
        );

        &::before {
          content: "";
          position: absolute;
          height: 100%;
          width: var(--dimension-width-button-selected-indicator);
          inset-inline-start: 0;
          background-color: var(--color-background-button-selected-indicator);
        }
      }
    }
  }
</style>
