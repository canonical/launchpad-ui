<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { UserChipProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds user-chip";

  let {
    class: className,
    size = "medium",
    userName,
    userAvatarUrl,
    showAvatar = true,
    ...rest
  }: UserChipProps = $props();
</script>

<div class={[componentCssClassName, className, size]} {...rest}>
  {#if showAvatar}
    <UserAvatar {userName} {userAvatarUrl} {size} />
  {/if}
  <span>
    {userName}
  </span>
</div>

<!-- @component
`UserChip` A component to display user name with an optional avatar.

## Example Usage
```svelte
<UserChip userName="John Doe" userAvatarUrl="https://example.com/avatar.png" />
```
-->
