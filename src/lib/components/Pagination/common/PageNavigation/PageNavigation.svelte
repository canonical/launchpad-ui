<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ChevronLeftIcon, ChevronRightIcon } from "@canonical/svelte-icons";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    SkipToEndIcon,
    SkipToStartIcon,
  } from "$lib/components/icons/index.js";
  import { getPaginationContext } from "../../context.js";
  import type { PageNavigationProps } from "./types.js";
  import "./styles.css";

  const componentCssClassName = "ds pagination-page-navigation";

  let { class: className, direction, ...rest }: PageNavigationProps = $props();

  const paginationContext = getPaginationContext();

  const ariaLabel = $derived(
    {
      first: "Go to first page",
      previous: "Go to previous page",
      next: "Go to next page",
      last: "Go to last page",
    }[direction],
  );
</script>

<ButtonPrimitive
  class={[componentCssClassName, className]}
  aria-label={ariaLabel}
  aria-controls={paginationContext.tableId}
  {...rest}
>
  {#if direction === "first"}
    <SkipToStartIcon />
  {:else if direction === "previous"}
    <ChevronLeftIcon />
  {:else if direction === "next"}
    <ChevronRightIcon />
  {:else if direction === "last"}
    <SkipToEndIcon />
  {/if}
</ButtonPrimitive>
