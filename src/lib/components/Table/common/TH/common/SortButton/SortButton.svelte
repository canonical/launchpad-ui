<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ButtonPrimitive } from "@canonical/svelte-ds-app-launchpad/internal";
  import { getTHContext } from "../../context.js";
  import { SortIndicator } from "../common/index.js";
  import type { SortButtonProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds table-th-sort";

  let { class: className, ...rest }: SortButtonProps = $props();

  const thContext = getTHContext();
</script>

<ButtonPrimitive
  class={[
    componentCssClassName,
    className,
    { sorted: thContext.sortDirection },
  ]}
  {...rest}
>
  <SortIndicator />
</ButtonPrimitive>
