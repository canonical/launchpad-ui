<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserChip from "./UserChip.svelte";

  const userAvatarUrl = "https://i.pravatar.cc/150?img=68";

  const { Story } = defineMeta({
    title: "UserChip",
    tags: ["autodocs"],
    component: UserChip,
    args: {
      userName: "John Doe",
      userAvatarUrl,
    },
  });
</script>

<Story name="Default" />

<Story name="Without avatar" args={{ showAvatar: false }} />

<Story name="Without imageURL" args={{ userAvatarUrl: undefined }} />

<Story name="Small" args={{ userName: "John Doe", modifiers: ["small"] }} />

<Story name="Large" args={{ userName: "John Doe", modifiers: ["large"] }} />
