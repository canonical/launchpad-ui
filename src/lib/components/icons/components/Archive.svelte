<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="archive" {...props}>
  <g id="archive">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 4.5V2.5H13.5V4.5H2.5ZM15 6H14V13.5C14 14.3284 13.3284 15 12.5 15H3.5C2.67157 15 2 14.3284 2 13.5V6H1V2.5C1 1.67157 1.67157 1 2.5 1H13.5C14.3284 1 15 1.67157 15 2.5V6ZM3.5 6H12.5V13.5H3.5V6ZM10 7.25H6V8.75H10V7.25Z" fill="currentColor"/>
  </g>
</BaseIcon>
