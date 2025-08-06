<!-- @canonical/generator-ds 0.9.0-experimental.22 -->

<script lang="ts">
  import type { TabListProps } from "./types.js";

  const componentCssClassName = "ds tabs";

  let { class: className, children, ...rest }: TabListProps = $props();
</script>

<nav class={[componentCssClassName, className]} {...rest}>
  <ul>
    {@render children?.()}
  </ul>
</nav>

<!-- @component
`TabList` A component for displaying tabbed navigation.

## Example Usage
```svelte
<TabList class="custom-class" id="unique-id">
  <TabList.Tab href="/home" active>Home</TabList.Tab>
  <TabList.Tab href="/about">About</TabList.Tab>
  <TabList.Tab href="/contact">Contact</TabList.Tab>
</TabList>
```
-->

<style>
  .ds.tabs {
    > ul {
      display: flex;
    }
  }
</style>
