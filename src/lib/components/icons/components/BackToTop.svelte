<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="back-to-top" {...props}>
  <g id="back-to-top">
    <path d="M7.99978 4.349L12.6848 9.033L11.8008 9.917L8.74878 6.866L8.74978 14.392H7.24978V6.866L4.19978 9.917L3.31478 9.033L7.99978 4.349ZM15.0248 1.25V2.75H1.05078V1.25H15.0248Z" fill="currentColor"/>
  </g>
</BaseIcon>
