<script lang="ts" module>
  import { seriesGroups } from "#lib/modules/distroseries/series.fixtures.js";
  import type { FilterChangeHandler } from "#lib/modules/filtering/types.js";
  import PackageFilters from "./PackageFilters.svelte";
  import type { PackageFilterInputs } from "./inputs.js";

  export const FILTER_LABEL_ID = "filter-label";

  export const submitOnChange: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();

  export { packageFilters };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    label,
    submissions,
    children,
  }: {
    label: string;
    submissions: [string, string][][];
    children: Snippet;
  } = $props();
</script>

<span id={FILTER_LABEL_ID}>{label}</span>
<form
  aria-labelledby={FILTER_LABEL_ID}
  onsubmit={(event) => {
    event.preventDefault();
    submissions.push(
      Array.from(new FormData(event.currentTarget), ([name, value]) => [
        name,
        String(value),
      ]),
    );
  }}
>
  {@render children()}
</form>

{#snippet packageFilters(inputs: PackageFilterInputs)}
  <PackageFilters {inputs} {seriesGroups} />
{/snippet}
