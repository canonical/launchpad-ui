<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Timeline } from "../../index.js";
  import Event from "./Event.svelte";

  const { Story } = defineMeta({
    title: "Components/Timeline/Event",
    tags: ["autodocs"],
    component: Event,
    argTypes: {
      titleRow: {
        control: {
          disable: true,
        },
      },
      children: {
        control: {
          disable: true,
        },
      },
    },
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, titleRow: __, ...args })}
    <Timeline>
      <Timeline.Event {...args}>
        {#snippet titleRow()}
          <Timeline.Event.TitleRow
            date={new Date("2023-03-15")}
            leadingText="Alvarez Daniella"
          >
            did something very special, that will be remembered forever
          </Timeline.Event.TitleRow>
        {/snippet}
        Description of the thing that was done
      </Timeline.Event>
    </Timeline>
  {/snippet}
</Story>

<Story
  name="With icon marker"
  argTypes={{
    markerSize: {
      control: false,
    },
  }}
  args={{ marker: "flag" }}
>
  {#snippet template({ children: _, titleRow: __, ...args })}
    <Timeline>
      <Timeline.Event {...args} markerSize="small">
        {#snippet titleRow()}
          <Timeline.Event.TitleRow
            date={new Date("2023-03-15")}
            leadingText="Alvarez Daniella"
          >
            next to a small icon marker
          </Timeline.Event.TitleRow>
        {/snippet}
      </Timeline.Event>
      <Timeline.Event {...args} markerSize="large">
        {#snippet titleRow()}
          <Timeline.Event.TitleRow
            date={new Date("2023-03-15")}
            leadingText="Alvarez Daniella"
          >
            next to a large icon marker
          </Timeline.Event.TitleRow>
        {/snippet}
      </Timeline.Event>
    </Timeline>
  {/snippet}
</Story>

<Story
  name="With a user avatar"
  argTypes={{
    markerSize: {
      control: false,
    },
  }}
  args={{
    marker: {
      userName: "Alvarez Daniella",
      userAvatarUrl: "https://i.pravatar.cc/150?img=48",
    },
  }}
>
  {#snippet template({ children: _, titleRow: __, ...args })}
    <Timeline>
      <Timeline.Event {...args} markerSize="small">
        {#snippet titleRow()}
          <Timeline.Event.TitleRow
            date={new Date("2023-03-15")}
            leadingText="Alvarez Daniella"
          >
            next to a small user avatar
          </Timeline.Event.TitleRow>
        {/snippet}
      </Timeline.Event>
      <Timeline.Event {...args} markerSize="large">
        {#snippet titleRow()}
          <Timeline.Event.TitleRow
            date={new Date("2023-03-15")}
            leadingText="Alvarez Daniella"
          >
            next to a large user avatar
          </Timeline.Event.TitleRow>
        {/snippet}
      </Timeline.Event>
    </Timeline>
  {/snippet}
</Story>

<Story name="With custom content">
  {#snippet template()}
    <Timeline>
      <Timeline.Event>
        <div class="placeholder-box center" style:height="150px">
          Custom content goes here
        </div>
      </Timeline.Event>
    </Timeline>
  {/snippet}
</Story>
