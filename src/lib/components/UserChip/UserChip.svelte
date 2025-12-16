<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { UserChipProps } from "./types.js";

  const componentCssClassName = "ds user-chip";

  let {
    class: className,
    size,
    userName,
    userAvatarUrl,
    showAvatar = true,
    ...rest
  }: UserChipProps = $props();
</script>

<div
  class={[componentCssClassName, className, size]}
  data-testid="user-chip"
  {...rest}
>
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

<style>
  .ds.user-chip {
    --typography-font-size-user-chip: var(
      --typography-font-size-context,
      var(--tmp-typography-font-size-s)
    );
    --dimension-gap-user-chip: var(
      --dimension-gap-context,
      var(--tmp-dimension-spacing-inline-xs)
    );

    display: inline-flex;
    align-items: center;
    font-size: var(--typography-font-size-user-chip);
    gap: var(--dimension-gap-user-chip);
  }
</style>
