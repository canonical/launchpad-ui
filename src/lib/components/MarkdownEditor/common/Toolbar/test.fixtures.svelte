<script lang="ts" module>
  export type FixtureAction = {
    id: string;
    label: string;
    disabled: boolean;
  };
</script>

<script lang="ts">
  import Toolbar from "./Toolbar.svelte";
  import { ActionButton } from "./common/index.js";

  let { actions }: { actions: FixtureAction[] } = $props();
</script>

<Toolbar data-test-no-default-actions data-testid="toolbar">
  {#each actions as action (action.id)}
    <ActionButton
      data-testid={action.id}
      label={action.label}
      disabled={action.disabled}
    >
      Icon
    </ActionButton>
  {/each}
</Toolbar>
