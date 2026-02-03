<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { SectionProps } from "./types.js";

  const componentCssClassName = "ds section";

  let { category, shortcuts }: SectionProps = $props();
</script>

<section class={componentCssClassName}>
  <div class="title">
    <h5>{category}</h5>
    <span aria-hidden="true">Shortcut</span>
    <span aria-hidden="true">Description</span>
  </div>
  <dl>
    {#each shortcuts as shortcut (shortcut)}
      <dt>{shortcut.metadata.label}</dt>
      <dd>
        <span class="visually-hidden">Shortcut:</span>
        {shortcut.toHumanReadable()}
      </dd>
      {#if shortcut.metadata.description}
        <dd class="description">
          <span class="visually-hidden">Description:</span>
          {shortcut.metadata.description}
        </dd>
      {/if}
    {/each}
  </dl>
</section>

<style>
  .ds.section {
    &:not(:last-child) {
      margin-block-end: var(
        --dimension-margin-block-shortcuts-help-modal-section-items
      );
    }
    dl,
    .title {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--dimension-margin-block-shortcuts-help-modal-section-items);
      margin-block: var(
        --dimension-margin-block-shortcuts-help-modal-section-items
      );
      white-space: pre-line;

      dt {
        grid-column: 1;
        text-align: left;
        text-wrap: nowrap;
        font: var(--typography-shortcuts-help-modal-dt);
      }

      dd {
        font: var(--typography-shortcuts-help-modal-dd);
        grid-column: 2;
        &.description {
          grid-column: 3;
        }
      }
    }

    .title {
      > * {
        font: var(--lp-typography-h5);
      }
    }
  }
</style>
