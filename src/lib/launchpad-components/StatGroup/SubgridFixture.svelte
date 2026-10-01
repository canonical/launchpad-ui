<script lang="ts">
  import { StatGroup } from "./index.js";
</script>

<div class="parent-grid" data-testid="parent-grid">
  <div class="external" data-testid="external">External content</div>
  <StatGroup columns={3} subgrid data-testid="stat-group">
    <StatGroup.Stat data-testid="stat-1">
      <StatGroup.Term>First</StatGroup.Term>
      <StatGroup.Description>1</StatGroup.Description>
    </StatGroup.Stat>
    <StatGroup.Stat data-testid="stat-2">
      <StatGroup.Term>Second</StatGroup.Term>
      <StatGroup.Description>2</StatGroup.Description>
    </StatGroup.Stat>
    <StatGroup.Stat data-testid="stat-3">
      <StatGroup.Term>Third</StatGroup.Term>
      <StatGroup.Description>3</StatGroup.Description>
    </StatGroup.Stat>
  </StatGroup>
</div>

<style>
  .parent-grid {
    display: grid;
    grid-template-columns: repeat(6, 100px);
  }

  .external {
    grid-column: span 3;
  }
</style>
