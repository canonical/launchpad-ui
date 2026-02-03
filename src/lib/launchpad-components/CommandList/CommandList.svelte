<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import type { CommandListProps } from "./types.js";

  let { children }: CommandListProps = $props();
</script>

<ol>
  {@render children?.()}
</ol>

<!-- @component
`CommandList` is a container component that organizes and displays a list of command entries.

## Example Usage
```svelte
<CommandList>
  <CommandList.Command
    status="EXECUTING"
    command='command config -r -d -c &quot;some strings here&quot; | grep &quot;something&quot; && echo &quot;done!&quot;'
    href="#line-862"
  />
  <CommandList.Command
    status="PENDING"
    command="another-command --with --various --flags"
  />
  <CommandList.Command
    status="FINISHED"
    command="final-command arg1 arg2 arg3"
    href="#line-900"
  />
</CommandList>
```
-->

<style>
  ol {
    display: flex;
    flex-direction: column;
    gap: var(--lp-dimension-spacing-block-xs);
  }
</style>
