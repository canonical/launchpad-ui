<script lang="ts">
  import { page } from "$app/state";

  const { name }: { name: string } = $props();

  const value = $derived(page.url.searchParams.get(name));
</script>

{#if value !== null}
  <input type="hidden" {name} {value} />
{/if}

<!-- @component
`QueryParamHiddenInput` A hidden input that ensures that `name` query parameter is preserved when submitting forms. This is useful for keeping pagination, sorting, and filtering parameters in native form submissions.
-->
