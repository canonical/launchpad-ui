<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="pause" {...props}>
  <g id="pause">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 3.02393H4V12.9917H5.5V3.02393ZM11.5 3.02393H10V12.9917H11.5V3.02393Z" fill="currentColor"/>
  </g>
</BaseIcon>
