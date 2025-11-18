<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="power-on" {...props}>
  <g id="power-on">
    <defs>
      <mask id="power-on-mask">
        <rect width="16" height="16" fill="black"/>
        <circle cx="8" cy="8" r="8" fill="white"/>
        <path d="M10.488 2.538a6.001 6.001 0 11-5.033.027v1.723a4.5 4.5 0 105.033-.039V2.54zM8.75.591V7h-1.5V.855L8.75.59z" fill="black"/>
      </mask>
    </defs>
    <rect width="16" height="16" fill="currentColor" mask="url(#power-on-mask)"/>
  </g>
</BaseIcon>
