<script lang="ts">
  import { IconBase } from "@canonical/svelte-icons";
  import type { IconProps } from "@canonical/svelte-icons";

  const props: IconProps = $props();
</script>

<IconBase iconName="bookmark" {...props}>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3.5C12 3.22386 11.7761 3 11.5 3H4.5C4.22386 3 4 3.22386 4 3.5V12.4727L8 10.291L12 12.4727V3.5ZM13.5 15L8 12L2.5 15V3.5C2.5 2.39543 3.39543 1.5 4.5 1.5H11.5L11.7041 1.51074C12.7128 1.613 13.5 2.46435 13.5 3.5V15Z"
      fill="currentColor"
    />
  </svg>
</IconBase>
