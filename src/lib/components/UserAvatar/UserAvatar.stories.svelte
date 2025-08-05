<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserAvatar from "./UserAvatar.svelte";

  const imageUrl = "https://i.pravatar.cc/150?img=68";

  const { Story } = defineMeta({
    title: "UserAvatar",
    tags: ["autodocs"],
    component: UserAvatar,
    args: {
      user: {
        name: "John Doe",
        imageUrl,
      },
      size: "medium",
    },
  });
</script>

<Story name="Default" />

<Story
  name="Without imageURL"
  args={{
    user: {
      name: "Jane Doe",
    },
  }}
/>

<Story name="Without user data" args={{ user: undefined }} />

<Story
  name="With invalid imageURL"
  args={{
    user: {
      name: "That's Not An Image",
      imageUrl: "invalid-url",
    },
  }}
/>

<Story
  name="With invalid imageURL and no name"
  args={{
    user: {
      imageUrl: "invalid-url",
    },
  }}
/>

<Story
  name="With a very long name"
  args={{
    user: {
      name: "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit",
    },
  }}
/>

<Story
  name="Large with initials"
  args={{
    user: {
      name: "Isaac Newton",
    },
    size: "large",
  }}
/>

<Story
  name="Large with icon"
  args={{
    user: undefined,
    size: "large",
  }}
/>

<Story
  name="Small with initials"
  args={{
    user: {
      name: "Walter White",
    },
    size: "small",
  }}
/>

<Story
  name="Small with icon"
  args={{
    user: undefined,
    size: "small",
  }}
/>
