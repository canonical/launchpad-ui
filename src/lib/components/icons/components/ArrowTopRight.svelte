<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="arrow-top-right" {...props}>
  <g id="arrow-top-right">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4064 4.49693H5.12249V2.99693H12.9675V10.8419H11.4675V5.55718L3.5631 13.4615L2.50244 12.4009L10.4064 4.49693Z" fill="currentColor"/>
  </g>
</BaseIcon>
