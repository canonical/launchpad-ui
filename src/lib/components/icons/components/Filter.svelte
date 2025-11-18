<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="filter" {...props}>
  <g id="filter">
    <path d="M2 3H14M6 13H10M4 8H12" stroke="black" stroke-width="1.5"/>
  </g>
</BaseIcon>
