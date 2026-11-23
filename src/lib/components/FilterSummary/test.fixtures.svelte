<script module lang="ts">
  import type {
    FilterRepresentationConfig,
    FilterTextPart,
  } from "#lib/filter/index.js";
  import { FilterSummary } from "./index.js";

  export { actions, children };

  export const testId = "filter-summary";

  type TaskFilters = {
    search?: string;
    match: "contains" | "exact";
    priority?: "High" | "Low";
    assignedToMe: boolean;
  };

  export const config = {
    match: { label: "Search mode", text: () => null },
    search: {
      label: "Search",
      text: (search, { match }) => [
        match === "exact" ? "Title is" : "Title contains",
        `"${search}"`,
      ],
    },
    priority: { label: "Priority" },
    assignedToMe: {
      label: "Assignee",
      text: (enabled) => (enabled ? "Assigned to me" : null),
    },
  } satisfies FilterRepresentationConfig<TaskFilters>;

  export const emptyFilters: TaskFilters = {
    match: "contains",
    assignedToMe: false,
  };
  export const activeFilters: TaskFilters = {
    search: "login",
    match: "contains",
    priority: "High",
    assignedToMe: true,
  };
</script>

{#snippet children(parts: FilterTextPart<TaskFilters>[])}
  <FilterSummary.Group parts={parts.filter((part) => part.key === "search")} />
  <FilterSummary.Group parts={parts.filter((part) => part.key !== "search")} />
{/snippet}

{#snippet actions()}
  <button type="button">Edit filters</button>
{/snippet}
