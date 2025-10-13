<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { modifiersControl } from "$lib/modifiers/index.js";
  import Link from "./Link.svelte";
  import { linkModifiers } from "./modifiers/index.js";

  const { Story } = defineMeta({
    title: "Components/Link",
    tags: ["autodocs"],
    component: Link,
    argTypes: {
      ...modifiersControl(linkModifiers),
    },
    args: {
      href: "https://ubuntu.com",
    },
  });
</script>

<Story name="Default">Link</Story>
