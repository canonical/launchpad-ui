<script lang="ts" module>
  // TODO(DAL): Export PopoverTriggerProps
  type PopoverTriggerProps =
    ComponentProps<typeof Popover>["trigger"] extends Snippet<
      [infer T, ...unknown[]]
    >
      ? T
      : never;
</script>

<script lang="ts">
  import { Button, Popover } from "@canonical/svelte-ds-app-launchpad";
  import { ChevronDownIcon } from "@canonical/svelte-icons";
  import type { ComponentProps, Snippet } from "svelte";

  let {
    children,
    icon,
    "aria-labelledby": ariaLabelledByProp,
    ...rest
  }: {
    children?: Snippet;
    icon?: Snippet;
    "aria-labelledby": string;
  } & PopoverTriggerProps = $props();

  const valueId = $props.id();

  const ariaLabelledBy = $derived.by(() => {
    if (!ariaLabelledByProp) return undefined;
    if (!children) return ariaLabelledByProp;
    return `${ariaLabelledByProp} ${valueId}`;
  });
</script>

<Button
  type="button"
  aria-labelledby={ariaLabelledBy}
  class="popover-trigger"
  importance="tertiary"
  {...rest}
>
  {#if children}
    <span id={valueId}>{@render children()}</span>
  {/if}
  {#snippet iconRight()}
    {#if icon}
      {@render icon()}
    {:else}
      <ChevronDownIcon class="chevron" />
    {/if}
  {/snippet}
</Button>

<style>
  :global {
    .ds.button.popover-trigger {
      font: inherit;
      text-align: end;

      .ds.button-content {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
      }

      &:has(+ :popover-open) {
        background-color: var(--color-foreground-ghost-active);

        .chevron {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
