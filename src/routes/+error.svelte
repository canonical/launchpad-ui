<script lang="ts">
  import { Woops } from "$lib/components/index.js";
  import { page } from "$app/state";
</script>

<Woops
  status={page.status}
  message={page.error?.message ?? "An unexpected error occurred"}
/>
