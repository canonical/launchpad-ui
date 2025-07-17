<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Tabs from "./Tabs.svelte";
  import { Tab } from "./common/Tab";

  const { Story } = defineMeta({
    title: "Components/Tabs/Tabs",
    tags: ["autodocs"],
    component: Tabs,
  });
</script>

<Story name="Default">
  <Tab active>Tab 1</Tab>
  <Tab>Tab 2</Tab>
  <Tab>Tab 3</Tab>
</Story>

<Story name="With many tabs">
  <Tab active>Tab 1</Tab>
  <Tab>Tab 2</Tab>
  <Tab>Tab 3</Tab>
  <Tab>Tab 4</Tab>
  <Tab>Tab 5</Tab>
  <Tab>Tab 6</Tab>
</Story>
