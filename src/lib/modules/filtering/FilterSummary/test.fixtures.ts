import type { FilterRepresentationConfig } from "../representation.js";

export type TaskFilters = {
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
