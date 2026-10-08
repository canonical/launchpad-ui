<script lang="ts">
  import "./styles.css";
  import type { MeterProps } from "./types.js";

  let { class: className, criticality, ...rest }: MeterProps = $props();
</script>

<meter class={["meter", className, criticality]} {...rest}> </meter>
