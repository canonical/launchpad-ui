<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { ArrowDownIcon, ArrowUpIcon } from "@canonical/svelte-icons";
  import { SortIcon } from "$lib/components/icons/index.js";
  import { getTHContext } from "../../../context.js";

  const thContext = getTHContext();
</script>

{#if thContext.ariaSort === "ascending"}
  <ArrowUpIcon aria-hidden="true" />
{:else if thContext.ariaSort === "descending"}
  <ArrowDownIcon aria-hidden="true" />
{:else}
  <SortIcon aria-hidden="true" />
{/if}
