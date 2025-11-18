<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="arrow-right" {...props}>
  <g id="arrow-right">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1535 8.7143L8.41715 12.4506L9.47781 13.5112L15.0251 7.96401L9.47781 2.41678L8.41715 3.47744L12.154 7.2143H0.975586V8.7143H12.1535Z" fill="currentColor"/>
  </g>
</BaseIcon>
