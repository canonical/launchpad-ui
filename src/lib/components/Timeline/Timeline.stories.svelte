<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import UserAvatar from "../UserAvatar/UserAvatar.svelte";
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
    <Timeline.Event>
      {#snippet marker()}
        <UserAvatar modifiers={["large"]} {...user} />
      {/snippet}
      {#snippet titleRow()}
        <Timeline.TitleRow trailingText={user.userName} {date}>
          added 1 commit
        </Timeline.TitleRow>
      {/snippet}
      Implementation of a new feature for Launchpad bug templates
    </Timeline.Event>
    <Timeline.Event>
      {#snippet marker()}
        <UserAvatar modifiers={["large"]} userName="asdfasdf" />
      {/snippet}
      {#snippet titleRow()}
        <span>Alvarez Daniella</span>
        <span>did</span>
      {/snippet}
      <div>Event 1</div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <span>Alvarez Daniella</span>
        <span>did</span>
      {/snippet}
      <div>Event 1</div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <span>Alvarez Daniella</span>
        <span>did</span>
      {/snippet}
      <div>Event 1</div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet titleRow()}
        <span>Alvarez Daniella</span>
        <span>did</span>
      {/snippet}
      <div>Event 1</div>
    </Timeline.Event>
    <Timeline.Event>
      {#snippet marker()}
        <UserAvatar />
      {/snippet}
      <div style="height: 150px; border: 1px solid salmon;">Event 2</div>
    </Timeline.Event>
  </Timeline>
</Story>
