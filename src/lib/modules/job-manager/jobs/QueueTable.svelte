<script lang="ts">
  import type {
    CapacityArchitectureEntry,
    JobStatus,
    RunnerStatus,
  } from "$lib/api/job-manager/types.js";

  const {
    capacities: rawCapacities,
    class: className,
  }: { capacities: CapacityArchitectureEntry[]; class?: string } = $props();

  // TODO: This can be removed once https://warthogs.atlassian.net/browse/LP-3772 is resolved
  const capacities = $derived(
    rawCapacities.map((capacity) => ({
      ...capacity,
      runners: {
        ...capacity.runners,
        status_counts: capacity.runners.status_counts as Record<
          RunnerStatus,
          (typeof capacity.runners.status_counts)[string]
        >,
      },
      jobs: {
        ...capacity.jobs,
        status_counts: capacity.jobs.status_counts as Record<
          JobStatus,
          (typeof capacity.jobs.status_counts)[string]
        >,
      },
    })),
  );
</script>

<table class={className}>
  <thead>
    <tr>
      <th scope="col" style="word-break: break-all;">Architectures</th>
      <th scope="col" class="runners">Runners</th>
      <th scope="col">Pending builds</th>
    </tr>
  </thead>
  <tbody>
    {#each capacities as capacity (capacity.architecture)}
      <tr>
        <th scope="row">{capacity.architecture}</th>
        <td class="runners">
          {#each ["BUSY", "IDLE", "ERROR"] as const as status (status)}
            {@const count = capacity.runners.status_counts[status]}
            {#if status !== "ERROR" || count > 0}
              <span>
                <span class="count">
                  {count}
                </span>
                <span class="label">&nbsp;{status}</span>
              </span>
            {/if}
          {/each}
        </td>
        <!-- TODO: Estimated queue burn time -->
        <td>{capacity.jobs.status_counts["PENDING"]}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    display: grid;
    grid-template-columns: auto repeat(5, minmax(auto, max-content)) repeat(
        2,
        auto
      );

    --queue-table-column-gap: var(--lp-dimension-spacing-inline-m);

    container: queue-table / inline-size;

    thead,
    tbody {
      display: contents;
    }

    tr {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
    }

    th,
    td {
      font: var(--lp-typography-paragraph-s);
      text-align: start;

      /* Define column gaps via margins instead of using column-gap, because we don't want to propagate gaps to the runners spans */
      &:not(:last-child) {
        margin-inline-end: var(--queue-table-column-gap);
      }
    }

    thead {
      th {
        font: var(--lp-typography-paragraph-s-strong);
      }

      tr {
        border-bottom: var(--dimension-stroke-thickness-default) solid
          var(--lp-color-border-default);
        padding-block-end: var(--lp-dimension-spacing-block-xs);
      }
    }

    tbody tr {
      padding-block: var(--lp-dimension-spacing-block-xxs);
      border-block-end: var(--dimension-stroke-thickness-default) solid
        var(--lp-color-border-low-contrast);

      @container queue-table (width > 400px) {
        border-block-end: none;
      }
    }

    .runners {
      grid-column: span 6;
    }

    td.runners {
      display: grid;
      grid-template-columns: subgrid;

      > span {
        grid-column: span 2;
        display: grid;
        margin-inline-end: var(--lp-dimension-spacing-inline-m);

        .count {
          text-align: end;
        }

        .label {
          text-align: end;
          color: var(--lp-color-text-muted);
        }
      }

      @container queue-table (width > 400px) {
        > span {
          grid-template-columns: subgrid;

          .label {
            text-align: start;
          }
        }
      }
    }
  }
</style>
