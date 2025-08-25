<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { MulticolorIcon } from "$lib/components/MulticolorIcon/index.js";
  import { UserAvatar } from "$lib/components/UserAvatar/index.js";
  import Timeline from "../../Timeline.svelte";
  import Event from "./Event.svelte";
  import { IconMarker, TitleRow } from "./common/index.js";

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
      marker: {
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
  {#snippet template()}
    <div class="timeline-event-wrapper">
      <Timeline>
        <Event>
          {#snippet titleRow()}
            <TitleRow
              date={new Date("2023-03-15")}
              trailingText="Alvarez Daniella"
            >
              did something special
            </TitleRow>
          {/snippet}
          Description of the thing that was done
        </Event>
      </Timeline>
    </div>
  {/snippet}
</Story>

<Story name="With icon marker">
  {#snippet template()}
    <div class="timeline-event-wrapper">
      <Timeline>
        <Event>
          {#snippet marker()}
            <IconMarker name="flag" modifiers={["small"]} />
          {/snippet}
          {#snippet titleRow()}
            <TitleRow
              date={new Date("2023-03-15")}
              trailingText="Alvarez Daniella"
            >
              next to a small icon marker
            </TitleRow>
          {/snippet}
        </Event>
        <Event>
          {#snippet marker()}
            <IconMarker name="flag" modifiers={["large"]} />
          {/snippet}
          {#snippet titleRow()}
            <TitleRow
              date={new Date("2023-03-15")}
              trailingText="Alvarez Daniella"
            >
              next to a large icon marker
            </TitleRow>
          {/snippet}
        </Event>
      </Timeline>
    </div>
  {/snippet}
</Story>

<Story name="With an user avatar">
  {#snippet template()}
    <div class="timeline-event-wrapper">
      <Timeline>
        <Event>
          {#snippet marker()}
            <UserAvatar
              userName="Alvarez Daniella"
              userAvatarUrl="https://i.pravatar.cc/150?img=48"
              modifiers={["small"]}
            />
          {/snippet}
          {#snippet titleRow()}
            <TitleRow
              date={new Date("2023-03-15")}
              trailingText="Alvarez Daniella"
            >
              next to a small user avatar
            </TitleRow>
          {/snippet}
        </Event>
        <Event>
          {#snippet marker()}
            <UserAvatar userName="Alvarez Daniella" modifiers={["large"]} />
          {/snippet}
          {#snippet titleRow()}
            <TitleRow
              date={new Date("2023-03-15")}
              trailingText="Alvarez Daniella"
            >
              next to a large user avatar
            </TitleRow>
          {/snippet}
        </Event>
      </Timeline>
    </div>
  {/snippet}
</Story>

<Story name="Without custom content">
  {#snippet template()}
    <div class="timeline-event-wrapper">
      <Timeline>
        <Event>
          {#snippet marker()}
            <MulticolorIcon name="error" />
          {/snippet}
          <div
            style="height: 150px; border: 1px solid gray; font-size: 2rem; display: grid; place-content: center;"
          >
            Custom content goes here
          </div>
        </Event>
      </Timeline>
    </div>
  {/snippet}
</Story>

<style>
  .timeline-event-wrapper {
    /* Hide the timeline connector */
    :global(.ds.timeline::before) {
      display: none;
    }
  }
</style>
