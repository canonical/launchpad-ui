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
  <Stat.Item key={firstTerm}>{firstDescription}</Stat.Item>
  <Stat.Item key={secondTerm}>{secondDescription}</Stat.Item>
{/snippet}

{#snippet childrenWithItemAttributes()}
  <Stat.Item
    key={firstTerm}
    class="custom-item"
    id="bug-count"
    aria-label="Bug count"
  >
    {firstDescription}
  </Stat.Item>
{/snippet}
