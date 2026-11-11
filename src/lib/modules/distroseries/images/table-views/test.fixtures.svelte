<script lang="ts">
  import { getImagesContext } from "../context.js";
  import ManageViewsSidePanel from "./ManageViewsSidePanel.svelte";

  const context = getImagesContext();
</script>

<!-- Opened by the URL, as on the packages page -->
<ManageViewsSidePanel open={context.queryParams.panel === "manage-views"} />
