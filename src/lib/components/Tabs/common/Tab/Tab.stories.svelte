<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Tab from "./Tab.svelte";

  const { Story } = defineMeta({
    title: "Components/Tabs/Tab",
    tags: ["autodocs"],
    component: Tab,
    args: {
      href: "#",
    },
  });
</script>

<Story name="Default">Tab</Story>

<Story
  name="Active"
  args={{
    active: true,
  }}
>
  Tab
</Story>
