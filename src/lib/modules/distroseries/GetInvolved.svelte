<script lang="ts">
  import { Link } from "@canonical/svelte-ds-app-launchpad";
  import {
    BugIcon,
    CommentsIcon,
    FileIcon,
    NotificationsIcon,
  } from "@canonical/svelte-icons";
  import type { IconProps } from "@canonical/svelte-icons";
  import type { Component } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let {
    links,
    class: className,
  }: {
    links: {
      reportBug: string;
      askQuestion: string;
      translate: string;
      subscribeToBugs: string;
    };
    class?: ClassValue;
  } = $props();
</script>

{#snippet linkItem({
  text,
  icon: Icon,
  href,
}: {
  text: string;
  icon: Component<IconProps>;
  href?: string;
})}
  {#if href}
    <li>
      <Link {href} soft class="icon-link">
        <Icon aria-hidden="true" />
        {text}
      </Link>
    </li>
  {/if}
{/snippet}

<nav class={className} aria-labelledby="get-involved-heading">
  <h2 id="get-involved-heading">Get involved</h2>
  <ul>
    {@render linkItem({
      text: "Report a bug",
      icon: BugIcon,
      href: links.reportBug,
    })}
    {@render linkItem({
      text: "Ask a question",
      icon: CommentsIcon,
      href: links.askQuestion,
    })}
    {@render linkItem({
      text: "Help translate",
      icon: FileIcon,
      href: links.translate,
    })}
    {@render linkItem({
      text: "Subscribe to bugs",
      icon: NotificationsIcon,
      href: links.subscribeToBugs,
    })}
  </ul>
</nav>

<style>
  h2 {
    margin-block-end: var(--space-100);
    font: inherit;
    color: var(--color-text-muted);
  }

  ul {
    list-style: none;
  }

  li + li {
    margin-block-start: var(--space-050);
  }

  li :global(.icon-link) {
    display: inline-flex;
    align-items: baseline;
    gap: var(--space-050);
  }
</style>
