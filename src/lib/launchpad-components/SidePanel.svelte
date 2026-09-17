<script lang="ts" module>
</script>

<script lang="ts">
  import { SidePanel } from "@canonical/svelte-ds-app-launchpad";
  import type { SidePanelProps } from "@canonical/svelte-ds-app-launchpad";
  import type { Snippet } from "svelte";
  import { browser } from "$app/environment";

  let {
    title,
    children: childrenSnippet,
    footer,
    closeFormContent,
    ...rest
  }: Omit<SidePanelProps, "children" | "closeOnOutsideClick" | "closedby"> & {
    title?: string;
    children: Snippet;
    /**
     * Footer content of the SidePanel. It receives props for buttons that should close the panel.
     */
    footer?: Snippet<[ReturnType<typeof closeButtonProps>]>;
    /**
     * Form with hidden inputs to keep keep the query parameters intact when closing the SidePanel in the absence of JavaScript.
     */
    closeFormContent?: Snippet;
  } = $props();

  const closeFormId = $props.id();

  function closeButtonProps(commandfor: string) {
    if (browser || !closeFormContent) {
      return {
        commandfor,
        command: "close",
        type: "button",
      } as const;
    }
    return {
      form: closeFormId,
      type: "submit",
    } as const;
  }

  // Disable light dismiss when no JS, because otherwise we wouldn't have a way to clear the query param.
  const closeOnOutsideSuppress = !browser
    ? // Use `closedby: none` directly to also suppress the native platform dismissal (e.g. Escape key)
      { closedby: "none" as const }
    : // After hydration, switch to `closeOnOutsideClick` to get the WebKit fallback. To be removed, when the below TODO(DAL) is resolved.
      { closeOnOutsideClick: true };
</script>

<!-- 
TODO(DAL):
- Update SidePanel spacing to match the design
- Get rid of the `closeOnOutsideClick` prop and instead make the consumer use the native `closedby` directly while still keeping the fallback behavior for WebKit. (https://warthogs.atlassian.net/browse/LP-4467)
-->
<SidePanel {...closeOnOutsideSuppress} {...rest}>
  {#snippet children(commandfor)}
    <SidePanel.Content>
      <SidePanel.Content.Header>
        {#if title}<h2>{title}</h2>{/if}
        <SidePanel.Content.Header.CloseButton
          {...closeButtonProps(commandfor)}
        />
      </SidePanel.Content.Header>
      <SidePanel.Content.Body style="flex-grow: 1;">
        {@render childrenSnippet?.()}
      </SidePanel.Content.Body>
      {#if footer}
        <SidePanel.Content.Footer>
          {@render footer?.(closeButtonProps(commandfor))}
        </SidePanel.Content.Footer>
      {/if}
    </SidePanel.Content>
  {/snippet}
</SidePanel>

{#if closeFormContent}
  <form id={closeFormId} class="visually-hidden" method="GET">
    {@render closeFormContent()}
  </form>
{/if}

<!-- @component
An application-level facade around the design-system `SidePanel` for URL-driven panels.
-->

<style>
  h2 {
    font: var(--ds-typography-heading-4);
  }
</style>
