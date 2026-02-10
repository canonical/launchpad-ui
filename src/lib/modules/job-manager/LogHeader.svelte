<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { FullscreenIcon, MenuContextualIcon } from "@canonical/svelte-icons";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    ChevronCollapseIcon,
    SkipToBottomIcon,
    SkipToTopIcon,
  } from "$lib/components/icons/index.js";
  import {
    Button,
    ContextualMenuContent,
    Popover,
  } from "$lib/components/index.js";
  import type { TimeZone } from "$lib/components/index.js";
  import { Shortcut, useShortcuts } from "$lib/shortcuts/index.js";
  import { useFullScreen } from "./useFullScreen.svelte.js";
  import { browser } from "$app/environment";

  let {
    timeZone = $bindable(),
    showTimestamps = $bindable(),
    wrapLines = $bindable(),
    viewLogUrl,
    downloadLogUrl,
    scrollToTopHref,
    scrollToBottomHref,
  }: {
    timeZone: TimeZone;
    showTimestamps: boolean;
    wrapLines: boolean;
    viewLogUrl?: string;
    downloadLogUrl?: string;
    scrollToTopHref?: string;
    scrollToBottomHref?: string;
  } = $props();

  const fullScreen = useFullScreen();
  const fullScreenLinkLabel = $derived(
    fullScreen.isEnabled ? "Exit full screen" : "View in full screen",
  );

  let isPopoverOpen = $state(false);

  const toggleFullScreenShortcut = new Shortcut(
    "f",
    { label: "Toggle viewing log full screen" },
    () => {
      fullScreen.toggle();
    },
  );
  const exitFullScreenShortcut = new Shortcut(
    "escape",
    { label: "Exit viewing log full screen" },
    () => {
      fullScreen.disable();
    },
    {
      // If the popover is open, close it first instead of exiting full screen
      predicate: () => !isPopoverOpen,
    },
    () => fullScreen.isEnabled,
  );
  useShortcuts(() => [toggleFullScreenShortcut, exitFullScreenShortcut]);
</script>

<div class="log-header">
  <span class="time-zone"
    >Timestamps in {timeZone === "UTC" ? "UTC" : "Local time"}</span
  >
  {#if scrollToTopHref}
    <ButtonPrimitive
      class="scroll-link header-button"
      href={scrollToTopHref}
      aria-label="Scroll to top of logs"
    >
      <SkipToTopIcon />
    </ButtonPrimitive>
  {/if}
  {#if scrollToBottomHref}
    <ButtonPrimitive
      class="scroll-link header-button"
      href={scrollToBottomHref}
      aria-label="Scroll to bottom of logs"
    >
      <SkipToBottomIcon />
    </ButtonPrimitive>
  {/if}
  <ButtonPrimitive
    class="scroll-link header-button"
    href={fullScreen.toggleHref}
    aria-label={fullScreenLinkLabel}
  >
    {#if fullScreen.isEnabled}
      <!-- TODO(@Enzo): Correct icon -->
      <ChevronCollapseIcon />
    {:else}
      <FullscreenIcon />
    {/if}
  </ButtonPrimitive>
  <Popover
    position="block-end span-inline-start"
    ontoggle={(e) => {
      isPopoverOpen = e.newState === "open";
    }}
  >
    {#snippet trigger(triggerProps)}
      <Button
        {...triggerProps}
        aria-label="Log options"
        severity="base"
        class="header-button"
      >
        <MenuContextualIcon />
      </Button>
    {/snippet}
    <ContextualMenuContent>
      {#if browser}
        <ContextualMenuContent.Group>
          <ContextualMenuContent.CheckboxItem
            text="Show timestamps"
            bind:checked={showTimestamps}
          />
          <ContextualMenuContent.CheckboxItem
            text="Wrap lines"
            bind:checked={wrapLines}
          />
        </ContextualMenuContent.Group>
        <ContextualMenuContent.Group
          groupTitle="Timezone"
          disabled={!showTimestamps}
        >
          <ContextualMenuContent.RadioItem
            text="UTC"
            value="UTC"
            bind:group={timeZone}
          />
          <ContextualMenuContent.RadioItem
            text="Local time"
            value="Local"
            bind:group={timeZone}
          />
        </ContextualMenuContent.Group>
      {/if}
      <ContextualMenuContent.Group>
        <ContextualMenuContent.ButtonItem
          href={fullScreen.toggleHref}
          text={fullScreenLinkLabel}
        />
        {#if viewLogUrl}
          <!-- TODO: Revisit, when Content-Disposition header is correctly set -->
          <ContextualMenuContent.ButtonItem
            text="View raw log"
            href={viewLogUrl}
          />
        {/if}
        {#if downloadLogUrl}
          <ContextualMenuContent.ButtonItem
            href={downloadLogUrl}
            download
            text="Download log"
          />
        {/if}
      </ContextualMenuContent.Group>
    </ContextualMenuContent>
  </Popover>
</div>

<style>
  .log-header {
    display: flex;
    align-items: center;
    justify-content: end;
    position: sticky;
    top: 0;
    z-index: 1;
    height: var(--header-height);
    background-color: var(--lp-color-background-default);
    padding-inline-end: var(--lp-dimension-spacing-inline-s);

    .time-zone {
      padding-inline: var(--lp-dimension-spacing-inline-m);
      padding-block: var(--lp-dimension-spacing-block-xs);
      font: var(--lp-typography-paragraph-s);
      color: var(--lp-color-text-muted);
      margin-inline-end: var(--lp-dimension-spacing-inline-m);
    }

    :global(> .scroll-link) {
      display: grid;
      place-items: center;
    }

    :global(> .header-button) {
      align-self: stretch;
    }
  }
</style>
