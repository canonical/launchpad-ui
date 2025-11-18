<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="cursor" {...props}>
  <g id="cursor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8403 8.89592L4.42529 1.1701L4.63418 12.5919L7.39364 9.58624L9.49104 14.2431L10.8587 13.6271L8.76144 8.97051L12.8403 8.89592Z" fill="currentColor"/>
  </g>
</BaseIcon>
