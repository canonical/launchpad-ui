<!-- @canonical/generator-ds 0.10.0-experimental.5 -->

<script lang="ts">
  import { MenuContextualIcon } from "@canonical/svelte-icons";
  import { ButtonPrimitive } from "$lib/components/common/index.js";
  import {
    SkipToBottomIcon,
    SkipToTopIcon,
  } from "$lib/components/icons/index.js";
  import {
    Button,
    ContextualMenuContent,
    Popover,
  } from "$lib/components/index.js";
  import type { TimeZone } from "$lib/components/index.js";
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
</script>

<div class="log-header">
  <span class="time-zone"
    >Timestamps in {timeZone === "UTC" ? "UTC" : "Local time"}</span
  >
  {#if scrollToTopHref}
    <ButtonPrimitive
      class="scroll-link header-button"
      as="a"
      href={scrollToTopHref}
      aria-label="Scroll to top of logs"
    >
      <SkipToTopIcon />
    </ButtonPrimitive>
  {/if}
  {#if scrollToBottomHref}
    <ButtonPrimitive
      class="scroll-link header-button"
      as="a"
      href={scrollToBottomHref}
      aria-label="Scroll to bottom of logs"
    >
      <SkipToBottomIcon />
    </ButtonPrimitive>
  {/if}
  <Popover position="block-end span-inline-start">
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
        <ContextualMenuContent.LinkItem
          disabled={true}
          text="View in full screen"
        />
        {#if viewLogUrl}
          <!-- TODO: Revisit, when Content-Disposition header is correctly set -->
          <ContextualMenuContent.LinkItem
            text="View raw log"
            href={viewLogUrl}
          />
        {/if}
        {#if downloadLogUrl}
          <ContextualMenuContent.LinkItem
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
    background-color: var(--tmp-color-background-default);
    padding-inline-end: var(--tmp-dimension-spacing-inline-s);

    .time-zone {
      padding-inline: var(--tmp-dimension-spacing-inline-m);
      padding-block: var(--tmp-dimension-spacing-block-xs);
      font: var(--tmp-typography-paragraph-s);
      color: var(--tmp-color-text-muted);
      margin-inline-end: var(--tmp-dimension-spacing-inline-m);
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
