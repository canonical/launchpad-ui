<!-- @canonical/generator-ds 0.10.0-experimental.3 -->
<script lang="ts" module>
  let globalProviderPresent = false;
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import type { ShortcutsProviderProps } from "./types.js";
  import { useShortcutProvider } from "./utils/useShortcutProvider.svelte.js";

  const { children }: ShortcutsProviderProps = $props();

  const { onkeydown } = useShortcutProvider();

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

 ## Example Usage
 ```svelte
 <GlobalShortcutsProvider>
   <YourAppComponents />
 </GlobalShortcutsProvider>
 ```
-->
