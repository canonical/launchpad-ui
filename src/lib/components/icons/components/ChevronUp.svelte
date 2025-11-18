<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="chevron-up" {...props}>
  <g id="chevron-up">
    <path d="M8.187 4.5L2 10.687L3.06 11.748L8.187 6.621L13.313 11.748L14.374 10.687L8.187 4.5Z" fill="currentColor"/>
  </g>
</BaseIcon>
