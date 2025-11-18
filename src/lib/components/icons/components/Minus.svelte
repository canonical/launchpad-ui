<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="minus" {...props}>
  <g id="minus">
    <path d="M14.8489 7.25V8.75H1.1499V7.25H14.8489Z" fill="currentColor"/>
  </g>
</BaseIcon>
