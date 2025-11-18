<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="menu" {...props}>
  <g id="menu">
    <path d="M14 12.25V13.75H2V12.25H14ZM14 7.25V8.75H2V7.25H14ZM14 2.25V3.75H2V2.25H14Z" fill="currentColor"/>
  </g>
</BaseIcon>
