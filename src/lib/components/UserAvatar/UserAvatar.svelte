<script lang="ts">
  import { UserIcon } from "@canonical/svelte-icons";
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import type { UserAvatarProps } from "./types.js";

  const componentCssClassName = "ds user-avatar";

  const {
    class: className,
    userName,
    userAvatarUrl,
    size,
    ...rest
  }: UserAvatarProps = $props();
  const avatarProps = $derived({
    ...rest,
    class: [componentCssClassName, className, size],
  });
</script>

{#if userAvatarUrl}
  <!--
  Testing shows that on both Chrome and Firefox, the PNG and JPEG images are displayed correctly, when the type is set to "image/png".
  SVGs are displayed correctly by Chrome, but Firefox immediately resorts to the fallback.
  -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- Add `tabindex="-1"` for firefox, where <object> can be keyboard-focused -->
  <object
    data={userAvatarUrl}
    title={userName}
    role="img"
    aria-label={!userName ? "User avatar" : undefined}
    type="image/png"
    tabindex={-1}
    {...avatarProps}
  >
    {@render avatarFallback(true)}
  </object>
{:else}
  <span data-testid="user-avatar" {...avatarProps}>
    {@render avatarFallback()}
  </span>
{/if}

{#snippet avatarFallback(ariaHidden: boolean = false)}
  {#if userName}
    <abbr title={userName} aria-hidden={ariaHidden}
      >{userName
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")}</abbr
    >
  {:else}
    <UserIcon aria-label="User avatar" aria-hidden={ariaHidden} />
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

<style>
  .ds.user-avatar {
    --color-background-user-avatar: var(--lp-color-background-alt);
    --color-border-user-avatar: var(--lp-color-border-default);
    --dimension-border-width-user-avatar: var(
      --dimension-stroke-thickness-default
    );
    --dimension-size-user-avatar: var(
      --dimension-size-context,
      var(--lp-dimension-size-m)
    );
    --typography-font-size-user-avatar: var(
      --typography-font-size-context,
      var(--lp-typography-font-size-m)
    );

    display: inline-grid;
    place-content: center;
    overflow: hidden;
    line-height: 1;
    flex: none;
    user-select: none;

    border: var(--dimension-border-width-user-avatar) solid
      var(--color-border-user-avatar);
    background-color: var(--color-background-user-avatar);
    font-weight: var(--lp-typography-weight-bold);

    width: var(--dimension-size-user-avatar);
    height: var(--dimension-size-user-avatar);
    font-size: var(--typography-font-size-user-avatar);

    > abbr {
      text-transform: uppercase;
      text-decoration: none;
    }
  }
</style>
