<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Breadcrumbs from "./Breadcrumbs.svelte";
  import type { BreadcrumbsProps } from "./types.js";

  const { Story } = defineMeta({
    title: "Components/Breadcrumbs",
    tags: ["autodocs"],
    component: Breadcrumbs,
    argTypes: {
      minNumExpanded: {
        control: "select",
        options: ["all", 0, 1, 2, 3],
      },
    },
    args: {
      segments: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "Ubuntu", href: "/products/ubuntu" },
        { label: "Server", href: "/products/ubuntu/server" },
        {
          label: "Documentation",
          href: "/products/ubuntu/server/documentation",
        },
        {
          label: "Installation Guide",
          href: "/products/ubuntu/server/documentation/installation-guide",
        },
        {
          label: "Step 1: Download ISO",
        },
      ],
    },
  });
</script>

<Story
  name="All segment are links"
  args={{
    segments: [
      { label: "Project", href: "/launchpad" },
      { label: "Repository", href: "/launchpad/launchpad-ui" },
      {
        label: "Merge proposals",
        href: "/launchpad/launchpad-ui/merge-proposals",
      },
      {
        label: "475346: update ibugtarget for template",
        href: "/launchpad/launchpad-ui/merge-proposals/475346",
      },
    ],
  }}
/>

<Story
  name="Some segments are not links"
  args={{
    segments: [
      { label: "Project" },
      { label: "Repository", href: "/launchpad/launchpad-ui" },
      {
        label: "Merge proposals",
        href: "/launchpad/launchpad-ui/merge-proposals",
      },
      {
        label: "475346: update ibugtarget for template",
      },
    ],
  }}
/>

{#snippet narrow(args: BreadcrumbsProps)}
  <div class="placeholder-box" style:width="400px;">
    <Breadcrumbs {...args} />
  </div>
{/snippet}

<Story
  name="Collapsed when too narrow"
  args={{
    minNumExpanded: 0,
  }}
  template={narrow}
/>

<Story
  name="Limited number of segments collapsed"
  args={{
    minNumExpanded: 4,
  }}
  template={narrow}
/>

<Story
  name="Ellipsis when too narrow"
  args={{
    segments: [
      { label: "First level" },
      {
        label: "A very very very very very very very long second level",
        href: "/long-url",
      },
    ],
    minNumExpanded: 1,
  }}
  template={narrow}
/>
