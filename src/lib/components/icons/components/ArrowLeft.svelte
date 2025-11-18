<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="arrow-left" {...props}>
  <g id="arrow-left">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.8472 8.7143L7.58347 12.4506L6.52281 13.5112L0.975586 7.96401L6.52281 2.41678L7.58347 3.47744L3.84661 7.2143H15.0251V8.7143H3.8472Z" fill="currentColor"/>
  </g>
</BaseIcon>
