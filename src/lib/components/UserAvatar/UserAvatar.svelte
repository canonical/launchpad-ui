<script lang="ts">
  /* @canonical/generator-ds 0.9.0-experimental.22 */
  import { UserIcon } from "@canonical/svelte-icons";
  import type { UserAvatarProps } from "./types.js";
  import "./styles.css";
  import { getInitials } from "./utils/getInitials.js";

  const componentCssClassName = "ds user-avatar";

  const {
    class: className,
    userName,
    userAvatarUrl,
    size = "medium",
    ...rest
  }: UserAvatarProps = $props();

  const userInitials = $derived(userName ? getInitials(userName) : null);

  let imageError = $state(false);
</script>

{#if userAvatarUrl && !imageError}
  <img
    class={[componentCssClassName, size, className]}
    src={userAvatarUrl}
    alt={userName ? `${userName}'s avatar` : "User avatar"}
    title={userName || undefined}
    data-initials={userInitials}
    onerror={() => (imageError = true)}
    {...rest}
  />
{:else}
  <div class={[componentCssClassName, "no-image", size, className]} {...rest}>
    {#if userName}
      <abbr title={userName}>{userInitials}</abbr>
    {:else}
      <UserIcon aria-label="User icon" />
    {/if}
  </div>
{/if}

<!-- @component
`UserAvatar` A component that displays a user's avatar.

The avatar will display the user's image if available and able to be loaded, otherwise it will display the first two user's initials. If neither is available, it will display a default icon placeholder.

In case JavaScript is disabled, and the image at `userAvatarUrl` fails to load, the component will provide a fallback (displaying the user's initials) only if the `userName` is provided.

## Example Usage
```svelte
<UserAvatar userName="John Doe" userAvatarUrl="https://example.com/avatar.png" />
```
-->
