<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="arrow-down" {...props}>
  <g id="arrow-down">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25006 12.1174L3.51379 8.38115L2.45312 9.4418L8.00035 14.989L13.5476 9.4418L12.487 8.38115L8.75006 12.118V0.939575H7.25006V12.1174Z" fill="currentColor"/>
  </g>
</BaseIcon>
