<!-- @canonical/generator-ds 0.10.0-experimental.3 -->

<script lang="ts">
  import type { ShortcutsProviderProps } from "./types.js";
  import { useShortcutProvider } from "./utils/useShortcutProvider.svelte.js";

  const cssComponentClassName = "ds shortcuts-provider";

  let { children, ignoreIfTyping = false }: ShortcutsProviderProps = $props();

  const { onkeydown } = useShortcutProvider(() => ignoreIfTyping);
</script>

<!-- 
  A wrapper (instead of an attachment passed down to children) has to be used here because:
  1. `keydown` events attached to elements by Svelte are delegated (https://svelte.dev/docs/svelte/basic-markup#Events-Event-delegation), so an attachment with `addEventListener` would not preserve the correct order of event listeners.
  2. The attachment approach would not work well with multiple children.
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cssComponentClassName}
  data-testid="shortcuts-provider"
  style="display: contents;"
  {onkeydown}
>
  {@render children()}
</div>

<!-- @component
 `ShortcutsProvider` is a component that provides keyboard shortcut functionality to its children. It listens for keyboard events and triggers the corresponding actions defined in the shortcuts.

 This provider **does not** ignore keyboard events when the target element is an input, textarea or select by default. This behavior can be customized using the `ignoreIfTyping` prop.

 ## Example Usage
 ```svelte
 <ShortcutsProvider>
   <YourAppComponents />
 </ShortcutsProvider>
 ```
-->
