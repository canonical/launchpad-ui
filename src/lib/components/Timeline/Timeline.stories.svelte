<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Timeline } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Timeline",
    tags: ["autodocs"],
    component: Timeline,
  });

  const user = {
    userName: "Alvarez Daniella",
    userAvatarUrl: "https://i.pravatar.cc/150?img=48",
  };

  const date = new Date("2023-03-15");
</script>

<Story name="Default" asChild>
  <Timeline>
    <Timeline.Event marker={user} markerSize="large">
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName} {date}>
          added 1 commit and filed 2 issues
        </Timeline.Event.TitleRow>
      {/snippet}
      Implementation of a new feature for Launchpad bug templates
    </Timeline.Event>
    <Timeline.Event marker="text">
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName} {date}>
          did things that are really complex and will probably take a while to
          explain
        </Timeline.Event.TitleRow>
      {/snippet}
      <div class="placeholder-box center" style:height="50px">
        Here is some custom content
      </div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName} {date}>
          did some amazing things
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName} {date}>
          did so many things that it could be a blog post, but let's keep it
          short for now and just say that it was a lot
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event marker="flag" markerSize="small">
      {#snippet titleRow()}
        <Timeline.Event.TitleRow leadingText={user.userName} {date}>
          raised a flag
        </Timeline.Event.TitleRow>
      {/snippet}
      The flag was raised
    </Timeline.Event>
    <Timeline.HiddenEvents numHidden={3} showAllHref="?show-all" />
    <Timeline.Event marker="settings" markerSize="large">
      {#snippet titleRow()}
        <Timeline.Event.TitleRow {date}>
          The MP was <span style="color: var(--tmp-color-text-default)"
            >Merged</span
          >
        </Timeline.Event.TitleRow>
      {/snippet}
    </Timeline.Event>
    <Timeline.Event marker={{ userName: "John Doe" }} markerSize="large">
      <div class="placeholder-box center" style:height="150px">
        Content goes here
      </div>
    </Timeline.Event>
    <Timeline.HiddenEvents
      numHidden={888}
      showMoreHref="?show-more"
      showAllHref="?show-all"
    />
  </Timeline>
</Story>
