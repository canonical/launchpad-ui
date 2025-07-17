<!-- @canonical/generator-ds 0.9.0-experimental.22 -->

<script lang="ts">
  import type { TabsProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds tabs";

  let { class: className, children, ...rest }: TabsProps = $props();
</script>

<nav class={[componentCssClassName, className]} {...rest}>
  <ul>
    {@render children?.()}
  </ul>
</nav>

<!-- @component
`Tabs` A component for displaying tabbed navigation.

## Example Usage
```svelte
<Tabs class="custom-class" id="unique-id">
  <Tabs.Tab href="/home" active>Home</Tabs.Tab>
  <Tabs.Tab href="/about">About</Tabs.Tab>
  <Tabs.Tab href="/contact">Contact</Tabs.Tab>
</Tabs>
```
-->
