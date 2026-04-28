<!-- TODO: Proper error component -->

<script lang="ts">
  const {
    error,
  }: {
    error: App.Error | unknown;
  } = $props();

  const status = $derived(
    typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
      ? error.status
      : 500,
  );

  const message = $derived(
    typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof error.message === "string"
      ? error.message
      : "An unexpected error occurred",
  );
</script>

<h1>{status}: {message}</h1>
