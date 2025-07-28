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

  const fallback = $derived(
    user?.name
      ? ({
          type: "initials",
          name: user.name,
          initials: user.name
            .split(" ")
            .filter((word) => word.length > 0)
            .slice(0, 2)
            .map((word) => word[0])
            .join(""),
        } as const)
      : ({ type: "icon" } as const),
  );
</script>

<span class={[componentCssClassName, `size-${size}`, className]} {...rest}>
  {#if user?.imageUrl}
    <img
      src={user.imageUrl}
      alt={fallback.type === "icon" ? "User avatar" : fallback.name}
      title={fallback.type === "icon" ? undefined : fallback.name}
      class={["avatar-image", `fallback-${fallback.type}`]}
      style:--initials={`"${fallback.initials}"`}
    />
  {:else if fallback.type === "initials"}
    <abbr title={fallback.name}>
      {fallback.initials}
    </abbr>
  {:else if fallback.type === "icon"}
    <Icon name="user" aria-label="User avatar" />
  {/if}
</span>

<!-- @component
`UserAvatar` A component that displays a user's avatar.

The avatar will display the user's image if available and able to be loaded, otherwise it will display the first two user's initials. If neither is available, it will display a default icon placeholder.

## Example Usage
```svelte
<UserAvatar user={{ imageUrl: "https://example.com/avatar.png", name: "John Doe" }} />
```
-->
