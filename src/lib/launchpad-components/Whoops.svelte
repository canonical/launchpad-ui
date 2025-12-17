<!-- TODO: Proper error component -->

<script lang="ts">
  const { status, message }: { status: number; message: string } = $props();
</script>

<h1>{status}: {message}</h1>
