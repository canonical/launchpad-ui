import { onTestFinished } from "vitest";
import type { FilterChangeHandler } from "./packages-filters.js";

export const FILTERS_FORM_ID = "filters-form";
export const FILTER_LABEL_ID = "filter-label";

/** Submits the control's form, like the filters bar does. */
export const submitOnChange: FilterChangeHandler<unknown> = (event) =>
  event.currentTarget.form?.requestSubmit();

/**
 * Mounts the external label and form that a filter control references by id,
 * and records the entries of every submission.
 */
export function mountFiltersForm(label: string): [string, string][][] {
  const labelElement = document.createElement("span");
  labelElement.id = FILTER_LABEL_ID;
  labelElement.textContent = label;
  const form = document.createElement("form");
  form.id = FILTERS_FORM_ID;
  const submissions: [string, string][][] = [];
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submissions.push(
      Array.from(new FormData(form), ([name, value]) => [name, String(value)]),
    );
  });
  document.body.append(labelElement, form);
  onTestFinished(() => {
    labelElement.remove();
    form.remove();
  });
  return submissions;
}
