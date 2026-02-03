<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserAvatar from "./UserAvatar.svelte";

  const userAvatarUrl = "https://i.pravatar.cc/150?img=68";

  const { Story } = defineMeta({
    title: "Components/UserAvatar",
    tags: ["autodocs"],
    component: UserAvatar,
  });
</script>

<Story name="Default" args={{ userName: "John Doe", userAvatarUrl }} />

<Story name="Sizes" argTypes={{ size: { table: { disable: true } } }}>
  {#snippet template(args)}
    <div class="row">
      {#each ["small", "medium", "large"] as const as size (size)}
        <UserAvatar {...args} {size} userName={`John Doe (${size})`} />
      {/each}
    </div>
    <br />
    <div class="row">
      {#each ["small", "medium", "large"] as const as size (size)}
        <UserAvatar {...args} {size} userName={undefined} />
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Without user data" args={{ userName: undefined }} />

<Story
  name="With invalid imageURL"
  args={{
    userName: "That's Not An Image",
    userAvatarUrl: "invalid-url",
  }}
/>

<Story
  name="Without imageURL"
  args={{
    userName: "Jane Doe",
  }}
/>

<Story
  name="With invalid imageURL and no name"
  args={{
    userAvatarUrl: "invalid-url",
  }}
/>

<Story
  name="With a very long name"
  tags={["!autodocs"]}
  args={{
    userName: "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit",
  }}
/>
