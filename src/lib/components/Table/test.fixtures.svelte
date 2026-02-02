<script lang="ts" module>
  import { TH } from "./common/index.js";
  import type { SortDirection } from "./common/index.js";

  let sortDirection = $state<SortDirection>();
  const setSortDirection = (direction: SortDirection) => {
    sortDirection = direction;
  };

  const caption = "Table Caption";
  const thText = "Sortable Header Cell";
  const tdText = "Cell 1";
  const sortButtonText = `Sort by ${thText}`;

  export {
    caption,
    children,
    setSortDirection,
    sortButtonText,
    tdText,
    thText,
  };
</script>

{#snippet children()}
  <caption>{caption}</caption>
  <thead>
    <tr>
      <TH {sortDirection} scope="col">
        {thText}
        {#snippet action()}
          <TH.SortButton aria-label={sortButtonText} />
        {/snippet}
      </TH>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{tdText}</td>
    </tr>
  </tbody>
{/snippet}
