<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { TabList } from "./index.js";

  const { Story } = defineMeta({
    title: "TabList",
    tags: ["autodocs"],
    component: TabList,
  });
</script>

<Story name="Default" asChild>
  <TabList>
    <TabList.Tab href="/" active>Home</TabList.Tab>
    <TabList.Tab href="/about">About</TabList.Tab>
    <TabList.Tab href="/profile">Profile</TabList.Tab>
  </TabList>
</Story>

<Story name="With many tabs" asChild>
  <TabList>
    <TabList.Tab href="/tab1" active>Tab 1</TabList.Tab>
    <TabList.Tab href="/tab2">Tab 2</TabList.Tab>
    <TabList.Tab href="/tab3">Tab 3</TabList.Tab>
    <TabList.Tab href="/tab4">Tab 4</TabList.Tab>
    <TabList.Tab href="/tab5">Tab 5</TabList.Tab>
    <TabList.Tab href="/tab6">Tab 6</TabList.Tab>
  </TabList>
</Story>
