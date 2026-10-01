<script lang="ts" module>
  import { Description } from "./common/Description/index.js";
  import { Stat } from "./common/Stat/index.js";
  import { Term } from "./common/Term/index.js";

  export { sixStats, threeStats };
</script>

{#snippet threeStats()}
  <Stat featured data-testid="stat-1">
    <Term>Images built</Term>
    <Description><strong>35</strong>/41</Description>
  </Stat>
  <Stat data-testid="stat-2">
    <Term>Failed to build</Term>
    <Description>2</Description>
  </Stat>
  <Stat data-testid="stat-3">
    <Term>Building</Term>
    <Description>4</Description>
  </Stat>
{/snippet}

{#snippet sixStats()}
  <Stat featured data-testid="stat-1">
    <Term>Images built with a deliberately wrapping label</Term>
    <Description>35/41</Description>
  </Stat>
  <Stat data-testid="stat-2">
    <Term>Failed to build</Term>
    <Description>2</Description>
  </Stat>
  <Stat featured data-testid="stat-3">
    <Term>Images passed tests</Term>
    <Description>22/35</Description>
  </Stat>
  <Stat data-testid="stat-4">
    <Term>Failed tests</Term>
    <Description>3</Description>
  </Stat>
  <Stat featured data-testid="stat-5">
    <Term>Open critical bugs</Term>
    <Description>1</Description>
  </Stat>
  <Stat data-testid="stat-6">
    <Term>Open bugs</Term>
    <Description>58</Description>
  </Stat>
{/snippet}
