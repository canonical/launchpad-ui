<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { modifiersControl } from "$lib/modifiers";
  import { userAvatarModifiers } from "../UserAvatar";
  import UserChip from "./UserChip.svelte";

  const userAvatarUrl = "https://i.pravatar.cc/150?img=68";

  const { Story } = defineMeta({
    title: "Components/UserChip",
    tags: ["autodocs"],
    component: UserChip,
    args: {
      userName: "John Doe",
      userAvatarUrl,
    },
    argTypes: {
      ...modifiersControl(userAvatarModifiers),
    },
  });
</script>

<Story name="Default" />

<Story name="Sizes">
  {#snippet template(args)}
    {#each userAvatarModifiers.size as size (size)}
      <UserChip
        {...args}
        userName={`John Doe (${size})`}
        modifiers={{ ...(args.modifiers || {}), size }}
      />
      <br /><br />
    {/each}
  {/snippet}
</Story>

<Story name="Without avatar" args={{ showAvatar: false }} />

<Story name="Without imageURL" args={{ userAvatarUrl: undefined }} />
