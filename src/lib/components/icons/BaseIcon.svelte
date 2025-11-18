<script lang="ts">
  import { getIconContext } from "./context.js";
  import type { BaseIconProps } from "./types.js";

  const {
    iconName,
    class: className,
    children,
    defs,
    ...rest
  }: BaseIconProps = $props();

  const stampId = $derived(`${iconName}-icon`);
  const componentCssClassName = $derived(`ds icon ${stampId}`);

  const iconsContext = getIconContext();

  // Chose a master during SSR
  let isDefinition = $state(
    !iconsContext || !iconsContext.registry.has(iconName),
  );
  // svelte-ignore state_referenced_locally
  if (isDefinition) {
    iconsContext?.registry.add(iconName);
  }

  $effect.pre(() => {
    if (!iconsContext) return;

    // If unmounted, make space for a new master
    if (isDefinition) return () => iconsContext.registry.delete(iconName);

    // If there is no master, become one!
    if (!iconsContext.registry.has(iconName)) {
      iconsContext.registry.add(iconName);
      isDefinition = true;
    }
  });
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 16 16"
  class={[componentCssClassName, className]}
  style={isDefinition ? "outline: 2px solid tomato; outline-offset: 2px;" : ""}
  {...rest}
>
  {#if isDefinition}
    <defs>
      {@render defs?.()}
      <symbol id={stampId}>
        {@render children()}
      </symbol>
    </defs>
  {/if}
  <use href={`#${stampId}`}></use>
</svg>

<style>
  .ds.icon {
    display: inline-grid;
    place-content: center;
    width: 1em;
    height: 1em;
  }
</style>
