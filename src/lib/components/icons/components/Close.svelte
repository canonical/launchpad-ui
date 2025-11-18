<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="close" {...props}>
  <g id="close">
    <path d="M13.0409 1.89799L14.1009 2.95799L9.0619 8L14.1019 13.042L13.0419 14.102L7.9999 9.062L2.9599 14.1L1.8999 13.04L6.9379 8L1.8999 2.96L2.9599 1.89999L7.9999 6.93999L13.0409 1.89799Z" fill="currentColor"/>
  </g>
</BaseIcon>
