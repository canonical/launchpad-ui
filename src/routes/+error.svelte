<script lang="ts">
  import { Whoops } from "$lib/launchpad-components/index.js";
  import { page } from "$app/state";
</script>

<Whoops
  status={page.status}
  message={page.error?.message ?? "An unexpected error occurred"}
/>
