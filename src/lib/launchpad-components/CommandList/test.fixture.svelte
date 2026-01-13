<script lang="ts" module>
  import { Command } from "./common/index.js";

  export { children };
</script>

{#snippet children()}
  <Command status="EXECUTING" command="some command" href="#line-42" />
  <Command status="FINISHED" command="some other command" />
  <Command status="PENDING" command="some yet another command" />
{/snippet}
