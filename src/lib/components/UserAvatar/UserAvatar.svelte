<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import { Icon } from "$lib/components/Icon/index.js";
  import type { UserAvatarProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds user-avatar";

  const {
    class: className,
    user,
    size = "medium",
    ...rest
  }: UserAvatarProps = $props();
  const avatarProps = $derived({
    ...rest,
    class: [componentCssClassName, `size-${size}`, className],
  });
</script>

{#if user?.imageUrl}
  <!--
  Testing shows that on both Chrome and Firefox, the PNG and JPEG images are displayed correctly, when the type is set to "image/png".
  SVGs are displayed correctly by Chrome, but Firefox immediately resorts to the fallback.
  -->
  <object
    data={user.imageUrl}
    title={user.name}
    role="img"
    aria-label={!user.name ? "User avatar" : undefined}
    type="image/png"
    {...avatarProps}
  >
    {@render avatarFallback(true)}
  </object>
{:else}
  <span {...avatarProps}>
    {@render avatarFallback()}
  </span>
{/if}

{#snippet avatarFallback(ariaHidden: boolean = false)}
  {#if user?.name}
    <abbr title={user.name} aria-hidden={ariaHidden}
      >{user.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")}</abbr
    >
  {:else}
    <Icon
      name="user"
      role="img"
      aria-label="User avatar"
      aria-hidden={ariaHidden}
      title={undefined}
    />
  {/if}
{/snippet}

<!-- @component
`UserAvatar` A component that displays a user's avatar.

The avatar will display the user's image if available and able to be loaded, otherwise it will display the first two user's initials. If neither is available, it will display a default icon placeholder.

## Example Usage
```svelte
<UserAvatar user={{ imageUrl: "https://example.com/avatar.png", name: "John Doe" }} />
```
-->
