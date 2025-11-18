<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="upload" {...props}>
  <g id="upload">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.19931 7.17686L7.25005 4.12613V11.7808H8.75005V4.1262L11.8007 7.17686L12.6846 6.29298L8.00001 1.6084L3.31543 6.29298L4.19931 7.17686ZM1 13.5001V11H2.5V13.5001H13.5V11H15V13.5001C15 14.3286 14.3284 15.0001 13.5 15.0001H2.5C1.67157 15.0001 1 14.3286 1 13.5001Z" fill="currentColor"/>
  </g>
</BaseIcon>
