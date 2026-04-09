<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserChip from "./UserChip.svelte";

  const userAvatarUrl = "https://assets.ubuntu.com/v1/fca94c45-snap+icon.png";

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
    {#each ["small", "medium", "large"] as const as size (size)}
      <UserChip {...args} userName="John Doe" {size} />
      <br />
    {/each}
  {/snippet}
</Story>

<Story name="Without avatar" args={{ showAvatar: false }} />

<Story name="Without avatar URL" args={{ userAvatarUrl: undefined }} />
