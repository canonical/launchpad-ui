<script module lang="ts">
  import { Stat } from "./index.js";

  const firstTerm = "Open bugs";
  const firstDetails = "58";
  const secondTerm = "In progress";
  const secondDetails = "16";

  export { children, firstDetails, firstTerm, secondDetails, secondTerm };
</script>

{#snippet children()}
  <Stat.Item term={firstTerm} details={firstDetails} />
  <Stat.Item term={secondTerm} details={secondDetails} marked />
{/snippet}
