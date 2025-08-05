<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserAvatar from "./UserAvatar.svelte";

  const userAvatarUrl = "https://i.pravatar.cc/150?img=68";

  const { Story } = defineMeta({
    title: "UserAvatar",
    tags: ["autodocs"],
    component: UserAvatar,
  });
</script>

<Story name="Default" args={{ userName: "John Doe", userAvatarUrl }} />

<Story
  name="Without imageURL"
  args={{
    userName: "Jane Doe",
  }}
/>

<Story name="Without user data" args={{ userName: undefined }} />

<Story
  name="With invalid imageURL"
  args={{
    userName: "That's Not An Image",
    userAvatarUrl: "invalid-url",
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
  args={{
    userName: "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit",
  }}
/>

<Story
  name="Large with initials"
  args={{
    userName: "Isaac Newton",
    modifiers: ["large"],
  }}
/>

<Story
  name="Large with icon"
  args={{
    userName: undefined,
    modifiers: ["large"],
  }}
/>

<Story
  name="Small with initials"
  args={{
    userName: "Walter White",
    modifiers: ["small"],
  }}
/>

<Story
  name="Small with icon"
  args={{
    modifiers: ["small"],
  }}
/>
