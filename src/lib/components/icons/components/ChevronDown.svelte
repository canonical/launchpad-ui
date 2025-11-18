<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="chevron-down" {...props}>
  <g id="chevron-down">
    <path d="M8.187 11.748L14.374 5.561L13.314 4.5L8.187 9.627L3.061 4.5L2 5.561L8.187 11.748Z" fill="currentColor"/>
  </g>
</BaseIcon>
