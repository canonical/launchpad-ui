<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { UserChipProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds user-chip";

  let {
    class: className,
    modifiers,
    userName,
    userAvatarUrl,
    showAvatar = true,
    ...rest
  }: UserChipProps = $props();
</script>

<div class={[componentCssClassName, className, modifiers]} {...rest}>
  {#if showAvatar}
    <UserAvatar {userName} {userAvatarUrl} aria-hidden="true" />
  {/if}
  <span>
    {userName}
  </span>
</div>

<!-- @component
`UserChip` A component to display user name with an optional avatar.

## Example Usage
```svelte
<UserChip user={{ name: "John Doe", imageUrl: "https://example.com/avatar.png" }} />
```
-->
