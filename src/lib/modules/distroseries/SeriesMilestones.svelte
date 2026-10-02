<script lang="ts">
  import { Link } from "@canonical/svelte-ds-app-launchpad";
  import type { ClassValue } from "svelte/elements";

  let {
    milestones,
    allMilestonesHref,
    class: className,
  }: {
    milestones: { name: string; date: string; url: string }[];
    allMilestonesHref: string;
    class?: ClassValue;
  } = $props();
</script>

<section class={className} aria-labelledby="milestones-heading">
  <h2 id="milestones-heading">Milestones</h2>
  <table aria-labelledby="milestones-heading">
    <tbody>
      {#each milestones as milestone (milestone.url)}
        <tr>
          <th scope="row">
            <Link href={milestone.url} soft>{milestone.name}</Link>
          </th>
          <td>
            <time datetime={milestone.date}>{milestone.date}</time>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Link href={allMilestonesHref}>All milestones</Link>
</section>

<style>
  h2 {
    margin-block-end: var(--space-100);
    font: inherit;
    color: var(--color-text-muted);
  }

  table {
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0 0 var(--space-050);
    vertical-align: top;
  }

  th {
    text-align: start;
    font-weight: inherit;
  }

  td {
    padding-inline-start: var(--space-150);
  }
</style>
