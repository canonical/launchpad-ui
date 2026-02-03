<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers/constants.js";
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
  });
</script>

<Story name="Default" />

<Story name="Sizes" argTypes={{ size: { table: { disable: true } } }}>
  {#snippet template(args)}
    {#each SEMANTIC_MODIFIERS.size as size (size)}
      <UserChip {...args} userName={`John Doe (${size})`} {size} />
      <br /><br />
    {/each}
  {/snippet}
</Story>

<Story name="Without avatar" args={{ showAvatar: false }} />

<Story name="Without imageURL" args={{ userAvatarUrl: undefined }} />
