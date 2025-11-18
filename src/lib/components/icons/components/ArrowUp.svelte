<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="arrow-up" {...props}>
  <g id="arrow-up">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.25006 3.81119L3.51379 7.54746L2.45312 6.4868L8.00035 0.939575L13.5476 6.4868L12.487 7.54746L8.75006 3.8106V14.989H7.25006V3.81119Z" fill="currentColor"/>
  </g>
</BaseIcon>
