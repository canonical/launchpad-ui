<script lang="ts">
  import { getPackagesContext } from "../context.js";
  import ManageViewsSidePanel from "./ManageViewsSidePanel.svelte";

  const context = getPackagesContext();
</script>

<!-- Opened by the URL, as on the packages page -->
<ManageViewsSidePanel open={context.queryParams.panel === "manage-views"} />
