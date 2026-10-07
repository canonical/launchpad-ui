<script lang="ts" module>
  import type { FilterChangeHandler } from "./types.js";

  export const FILTER_LABEL_ID = "filter-label";

  export const submitOnChange: FilterChangeHandler<unknown> = (event) =>
    event.currentTarget.form?.requestSubmit();
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
