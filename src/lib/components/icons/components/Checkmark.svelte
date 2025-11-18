<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="checkmark" {...props}>
  <g id="checkmark">
        <path d="M11.9191 3.524L13.1261 4.414L6.65414 13.2L2.99414 9.32L4.08614 8.29L6.51214 10.861L11.9191 3.524Z" fill="currentColor"/>
    </g>
</BaseIcon>
