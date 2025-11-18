<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="chevron-left" {...props}>
  <g id="chevron-left">
    <path d="M4.56299 8.124L10.75 14.311L11.811 13.251L6.68399 8.124L11.811 2.998L10.75 1.937L4.56299 8.124Z" fill="currentColor"/>
  </g>
</BaseIcon>
