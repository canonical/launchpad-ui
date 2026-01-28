<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { getDescriptionListContext } from "../../context.js";
  import type { ItemProps } from "./types.js";

  const componentCssClassName = "ds description-list-item";

  let { class: className, name, children, ...rest }: ItemProps = $props();

  const descriptionListContext = getDescriptionListContext();
</script>

<div
  class={[componentCssClassName, className, descriptionListContext.layout]}
  {...rest}
>
  <dt>{name}</dt>
  <dd>{@render children()}</dd>
</div>

<style>
  .ds.description-list-item {
    display: flex;
    flex-direction: column;
    gap: var(--tmp-dimension-spacing-block-xs);

    dt {
      order: 1;
      font: var(--tmp-typography-paragraph-s-strong);
      color: var(--tmp-color-text-muted);
    }

    dd {
      order: 3;
      font: var(--tmp-typography-paragraph-s);
      color: var(--tmp-color-text-default);
    }

    /* Horizontal line for list layout */
    &::before {
      content: "";
      order: 2;
      height: 1px;
      flex-grow: 1;
      background: repeating-linear-gradient(
        to right,
        var(--tmp-color-border-low-contrast) 0px 2px,
        transparent 2px 4px
      );
      flex-basis: 10%;

      display: none;
    }

    &.list {
      flex-direction: row;
      align-items: baseline;
      gap: var(--tmp-dimension-spacing-inline-xs);

      &::before {
        display: block;
      }

      dd {
        text-align: end;
      }
    }

    &.auto {
      /* Defined in DescriptionList.svelte */
      @container description-list (width <= 573px) {
        flex-direction: row;
        align-items: baseline;
        gap: var(--tmp-dimension-spacing-inline-xs);

        &::before {
          display: block;
        }

        dd {
          text-align: end;
        }
      }
    }
  }
</style>
