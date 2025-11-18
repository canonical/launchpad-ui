<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="chevron-right" {...props}>
  <g id="chevron-right">
    <path d="M11.811 8.124L5.62399 1.937L4.56299 2.997L9.68999 8.124L4.56299 13.25L5.62399 14.311L11.811 8.124Z" fill="currentColor"/>
  </g>
</BaseIcon>
