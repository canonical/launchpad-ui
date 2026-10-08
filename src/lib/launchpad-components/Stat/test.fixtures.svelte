<script module lang="ts">
  import { Stat } from "./index.js";

  const firstTerm = "Open bugs";
  const firstDescription = "58";
  const secondTerm = "In progress";
  const secondDescription = "16";

  export {
    children,
    childrenWithItemAttributes,
    firstDescription,
    firstTerm,
    secondDescription,
    secondTerm,
  };
</script>

{#snippet children()}
  <Stat.Item term={firstTerm} description={firstDescription} />
  <Stat.Item term={secondTerm} description={secondDescription} marked />
{/snippet}

{#snippet childrenWithItemAttributes()}
  <Stat.Item
    term={firstTerm}
    description={firstDescription}
    class="custom-item"
    id="bug-count"
    aria-label="Bug count"
  />
{/snippet}
