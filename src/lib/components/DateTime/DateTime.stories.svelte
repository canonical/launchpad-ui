<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import DateTime from "./DateTime.svelte";

  const { Story } = defineMeta({
    title: "Components/DateTime",
    tags: ["autodocs"],
    component: DateTime,
  });
</script>

<Story name="Now" args={{ date: new Date() }} />

<Story
  name="5 minutes ago"
  exportName="FiveMinutesAgo"
  args={{ date: new Date(Date.now() - 5 * 60 * 1000) }}
/>

<Story
  name="1 hour ago"
  exportName="OneHourAgo"
  args={{ date: new Date(Date.now() - 60 * 60 * 1000) }}
/>

<Story
  name="2 days ago"
  exportName="TwoDaysAgo"
  args={{ date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }}
/>

<Story
  name="1 week ago"
  exportName="OneWeekAgo"
  args={{ date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }}
/>

<Story
  name="In 2 days"
  args={{ date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }}
/>
