<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="single-host" {...props}>
  <g id="single-host">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9658 4.55568L7.99998 1.11133L2.03418 4.55568V11.4444L7.99998 14.8888L13.9658 11.4444V4.55568ZM3.53398 5.42104L7.99898 2.84304L12.465 5.42104V10.578L7.99898 13.156L3.53398 10.578V5.42104Z" fill="currentColor"/>
  </g>
</BaseIcon>
