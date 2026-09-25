<script lang="ts" generics="S extends SuperhrefSchema">
  import type { SuperhrefSchema } from "@canonical/superhref";
  import { createQueryParamsForm } from "./createQueryParamsForm.js";
  import type { QueryParamsFormProps } from "./types.js";

  const componentCssClassName = "ds query-params-form";

  const {
    schema,
    url,
    replaceParams,
    class: className,
    children,
    ...rest
  }: QueryParamsFormProps<S> = $props();

  const form = $derived(createQueryParamsForm(schema, url, replaceParams));

  function onformdata({ formData }: FormDataEvent): void {
    const formDataEntries = Array.from(
      formData,
      ([name, value]) => [name, String(value)] as const,
    );
    const formPatch = form.patch(formDataEntries);

    for (const [name, values] of Object.entries(formPatch)) {
      if (values.length === 0) {
        formData.delete(name);
      } else {
        const [first, ...remaining] = values;
        formData.set(name, first);
        for (const value of remaining) formData.append(name, value);
      }
    }
  }
</script>

<form
  class={[componentCssClassName, className]}
  method="GET"
  {onformdata}
  {...rest}
>
  <!-- eslint-disable-next-line svelte/require-each-key -->
  {#each form.preserveParams as [name, value]}
    <input type="hidden" {name} {value} />
  {/each}
  {@render children?.()}
</form>
