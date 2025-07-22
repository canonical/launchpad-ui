<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { fn } from "storybook/test";
  import Chip from "./Chip.svelte";

  const { Story } = defineMeta({
    title: "Chip",
    tags: ["autodocs"],
    component: Chip,
  });
</script>

<Story
  name="Default"
  args={{
    value: "Value",
  }}
/>

<Story
  name="Default with Lead"
  args={{
    key: "Lead",
    value: "Value",
  }}
/>

<Story
  name="Default positive"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["positive"],
  }}
/>

<Story
  name="Default information"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["information"],
  }}
/>

<Story
  name="Default caution with icon"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["caution"],
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet icon()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
          ></path>
        </svg>
      {/snippet}
    </Chip>
  {/snippet}
</Story>

<Story
  name="Default negative"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["negative"],
  }}
/>

<Story
  name="With dismiss"
  args={{
    value: "Value",
    onDismiss: fn(),
  }}
/>

<Story
  name="With badge"
  args={{
    key: "Lead",
    value: "Value",
    badge: {
      value: "2.5B",
      "aria-label": "2.5 billion",
    },
  }}
/>

<Story
  name="With badge and dismiss"
  args={{
    key: "Lead",
    value: "Value",
    onDismiss: fn(),
    badge: {
      value: "2.5B",
      "aria-label": "2.5 billion",
    },
  }}
/>

<Story
  name="Dense chip"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["dense"],
  }}
/>

<Story
  name="Read-only"
  args={{
    value: "Value",
    isReadonly: true,
  }}
/>

<Story
  name="Read-only with Lead"
  args={{
    key: "Lead",
    value: "Value",
    isReadonly: true,
  }}
/>

<Story
  name="Read-only positive"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["positive"],
    isReadonly: true,
  }}
/>

<Story
  name="Read-only information"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["information"],
    isReadonly: true,
  }}
/>
<Story
  name="Read-only caution with icon"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["caution"],
    isReadonly: true,
  }}
>
  {#snippet template(args)}
    <Chip {...args}>
      {#snippet icon()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"
          ></path>
        </svg>
      {/snippet}
    </Chip>
  {/snippet}
</Story>

<Story
  name="Read-only negative"
  args={{
    key: "Lead",
    value: "Value",
    modifiers: ["negative"],
    isReadonly: true,
  }}
/>
