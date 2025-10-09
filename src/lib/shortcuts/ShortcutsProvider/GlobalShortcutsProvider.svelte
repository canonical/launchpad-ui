<!-- @canonical/generator-ds 0.10.0-experimental.3 -->
<script lang="ts" module>
  let globalProviderPresent = false;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import type { GlobalShortcutsProviderProps } from "./types.js";
  import { useShortcutProvider } from "./utils/useShortcutProvider.svelte.js";

  const { children, ignoreIfTyping = true }: GlobalShortcutsProviderProps =
    $props();

  const { onkeydown } = useShortcutProvider(() => ignoreIfTyping);

  onMount(() => {
    if (globalProviderPresent) {
      console.warn(
        "A GlobalShortcutsProvider is already present in the application. Only one instance of GlobalShortcutsProvider should be used at the root of the application. Using multiple instances may lead to unexpected behavior.",
      );
    }

    globalProviderPresent = true;

    return () => {
      globalProviderPresent = false;
    };
  });
</script>

<svelte:window {onkeydown} />

{@render children()}

<!-- @component
 `GlobalShortcutsProvider` is a specialized version of `ShortcutsProvider` that listens for keyboard shortcuts at the global window level. Only one instance of `GlobalShortcutsProvider` should be used at the root of the application.

 The global provider ignores keyboard events when the target element is an input, textarea, or select by default. This behavior can be customized using the `ignoreIfTyping` prop.

 ## Example Usage
 ```svelte
 <GlobalShortcutsProvider>
   <YourAppComponents />
 </GlobalShortcutsProvider>
 ```
-->
