<script module lang="ts">
  import { DateTime } from "@canonical/svelte-ds-app-launchpad";
  import { SettingsIcon } from "@canonical/svelte-icons";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { FlagIcon, TextIcon } from "$lib/components/icons/index.js";
  import { Timeline } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Timeline",
    tags: ["autodocs"],
    component: Timeline,
  });

  const user = {
    userName: "Alvarez Daniella",
    userAvatarUrl: "https://assets.ubuntu.com/v1/fca94c45-snap+icon.png",
  };

  const today = new Date();
  const day = 24 * 60 * 60 * 1000;
</script>

<Story name="Default" asChild>
  <Timeline>
    <Timeline.Event marker={user} markerSize="large">
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName}>
          added 1 commit and filed 2 issues
          {#snippet date()}
            <DateTime date={new Date(today.getTime() - 5 * day)} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
      Implementation of a new feature for Launchpad bug templates
    </Timeline.Event>
    <Timeline.Event>
      {#snippet marker()}
        <TextIcon />
      {/snippet}
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName}>
          did things that are really complex and will probably take a while to
          explain
          {#snippet date()}
            <DateTime date={new Date(today.getTime() - 4 * day)} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
      <div class="placeholder-box center" style:height="50px">
        Here is some custom content
      </div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName}>
          did some amazing things
          {#snippet date()}
            <DateTime date={new Date(today.getTime() - 3 * day)} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName}>
          did so many things that it could be a blog post, but let's keep it
          short for now and just say that it was a lot
          {#snippet date()}
            <DateTime date={new Date(today.getTime() - 2 * day)} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event markerSize="small">
      {#snippet marker()}
        <FlagIcon />
      {/snippet}
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName}>
          raised a flag
          {#snippet date()}
            <DateTime date={new Date(today.getTime() - day)} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
      The flag was raised
    </Timeline.Event>
    <Timeline.HiddenEvents numHidden={3}>
      <Timeline.HiddenEvents.Link href="?show-all"
        >Show all</Timeline.HiddenEvents.Link
      >
    </Timeline.HiddenEvents>
    <Timeline.Event markerSize="large">
      {#snippet marker()}
        <SettingsIcon />
      {/snippet}
      {#snippet titleRow()}
        <Timeline.Event.TitleRow>
          The MP was <span style="color: var(--lp-color-text-default)"
            >Merged</span
          >
          {#snippet date()}
            <DateTime date={today} />
          {/snippet}
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event marker={{ userName: "John Doe" }} markerSize="large">
      <div class="placeholder-box center" style:height="150px">
        Content goes here
      </div>
    </Timeline.Event>
    <Timeline.HiddenEvents numHidden={888}>
      <Timeline.HiddenEvents.Link href="?show-more"
        >Show more</Timeline.HiddenEvents.Link
      >
      <Timeline.HiddenEvents.Link href="?show-all"
        >Show all</Timeline.HiddenEvents.Link
      >
    </Timeline.HiddenEvents>
  </Timeline>
</Story>
