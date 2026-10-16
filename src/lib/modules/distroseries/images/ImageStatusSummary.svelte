<script lang="ts">
  import { DescriptionList } from "@canonical/svelte-ds-app-launchpad";
  import { Meter } from "$lib/launchpad-components/index.js";

  let {
    heading,
    noun,
    total,
    completedLabel,
    completedCount,
    failed,
    running,
  }: {
    heading: string;
    noun: string;
    total: number;
    completedLabel: string;
    completedCount: number;
    failed: number;
    running: number;
  } = $props();

  const sum = $derived(completedCount + failed + running);

  const headingId = $props.id();
</script>

<section aria-labelledby={headingId}>
  <h3 id={headingId}>{heading}</h3>
  <DescriptionList layout="list" class="image-status-summary">
    <DescriptionList.Item name="Total">
      {sum}
    </DescriptionList.Item>
    <Meter aria-label={`Total ${noun}`} min="0" max={total} value={sum} />
    <DescriptionList.Item name={completedLabel}>
      {completedCount}
    </DescriptionList.Item>
    <Meter
      aria-label={`${completedLabel} ${noun}`}
      min="0"
      max={total}
      value={completedCount}
      criticality="success"
    />
    <DescriptionList.Item name="Failed">
      {failed}
    </DescriptionList.Item>
    <Meter
      aria-label={`Failed ${noun}`}
      min="0"
      max={total}
      value={failed}
      criticality="error"
    />
    <DescriptionList.Item name="Running">
      {running}
    </DescriptionList.Item>
    <Meter
      aria-label={`Running ${noun}`}
      min="0"
      max={total}
      value={running}
      criticality="information"
    />
  </DescriptionList>
</section>

<style>
  section {
    flex-grow: 1;
    margin-block-end: var(--space-300);
  }

  h3 {
    margin-block-end: var(--space-050);
  }

  :global(.image-status-summary) {
    > :global(.meter) {
      align-self: center;
    }

    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
    row-gap: var(--space-050);
    column-gap: var(--space-100);
    align-self: center;
  }
</style>
