<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Link from "./Link.svelte";

  const { Story } = defineMeta({
    title: "Components/Link",
    tags: ["autodocs"],
    component: Link,
    args: {
      href: "https://ubuntu.com",
    },
  });
</script>

<Story name="Default">Link</Story>
