<script lang="ts">
  import BaseIcon from "../BaseIcon.svelte";
  import type { IconProps } from "../types.js";

  const props: IconProps = $props();
</script>

<BaseIcon iconName="menu-contextual" {...props}>
  <g id="menu-contextual">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 12.4907C8.82843 12.4907 9.5 13.1622 9.5 13.9907C9.5 14.8191 8.82843 15.4907 8 15.4907C7.17157 15.4907 6.5 14.8191 6.5 13.9907C6.5 13.1622 7.17157 12.4907 8 12.4907ZM8 6.5C8.82843 6.5 9.5 7.17157 9.5 8C9.5 8.82842 8.82843 9.5 8 9.5C7.17157 9.5 6.5 8.82842 6.5 8C6.5 7.17157 7.17157 6.5 8 6.5ZM8 0.509338C8.82843 0.509338 9.5 1.18091 9.5 2.00934C9.5 2.83777 8.82843 3.50934 8 3.50934C7.17157 3.50934 6.5 2.83777 6.5 2.00934C6.5 1.18091 7.17157 0.509338 8 0.509338Z" fill="currentColor"/>
  </g>
</BaseIcon>
