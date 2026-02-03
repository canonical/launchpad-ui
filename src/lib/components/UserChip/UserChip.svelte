<!-- @canonical/generator-ds 0.9.1-experimental.0 -->

<script lang="ts">
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import type { UserChipProps } from "./types.js";

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

<div
  class={[componentCssClassName, className, size]}
  data-testid="user-chip"
  {...rest}
>
  {#if showAvatar}
    <UserAvatar {userName} {userAvatarUrl} {size} aria-hidden="true" />
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

<style>
  .ds.user-chip {
    display: inline-flex;
    align-items: center;

    font: var(--lp-typography-paragraph-default-strong);
    gap: var(--lp-dimension-spacing-inline-xs);

    &.small {
      font: var(--lp-typography-paragraph-s-strong);
      gap: var(--lp-dimension-spacing-inline-xxs);
    }

    &.large {
      font: var(--lp-typography-h5);
    }
  }
</style>
