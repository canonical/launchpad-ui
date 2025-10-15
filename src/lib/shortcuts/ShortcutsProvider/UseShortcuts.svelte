<script lang="ts">
  import type { UseShortcutsProps } from "./types.js";
  import { useShortcuts } from "./utils/useShortcuts.svelte.js";

  const { shortcuts }: UseShortcutsProps = $props();

  useShortcuts(() => shortcuts);
</script>

<!-- @component
 `UseShortcuts` is a Svelte component that registers keyboard shortcuts within the nearest `ShortcutsProvider`. It accepts a single prop, `shortcuts`, which can be a single `Shortcut` or an array of `Shortcut` instances.

 This is especially useful for components that need both define the `ShortcutsProvider` and register shortcuts.

 ## Example Usage
 ```svelte
 <ShortcutsProvider>
   <UseShortcuts shortcuts={new Shortcut("ctrl+s", {label: "Save Document"}, saveFunction)} />
   <YourAppComponents />
 </ShortcutsProvider>
 ```
-->
