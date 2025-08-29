<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Timeline } from "../../index.js";
  import HiddenEvents from "./HiddenEvents.svelte";

  const { Story } = defineMeta({
    title: "Components/Timeline/HiddenEvents",
    tags: ["autodocs"],
    component: HiddenEvents,
    args: {
      numHidden: 888,
      showMoreHref: "?showMore",
      showAllHref: "?showAll",
    },
  });
</script>

{#snippet dummyChild()}
  <div style="width: var(--tmp-dimension-size-l)"></div>
{/snippet}

<Story name="Default">
  {#snippet template(args)}
    <Timeline>
      <Timeline.HiddenEvents {...args} />
    </Timeline>
  {/snippet}
</Story>

<Story name="At the start of the timeline">
  {#snippet template(args)}
    <Timeline>
      <Timeline.HiddenEvents {...args} />
      {@render dummyChild()}
    </Timeline>
  {/snippet}
</Story>

<Story name="At the end of the timeline">
  {#snippet template(args)}
    <Timeline>
      {@render dummyChild()}
      <Timeline.HiddenEvents {...args} />
    </Timeline>
  {/snippet}
</Story>

<Story name="In the middle of the timeline">
  {#snippet template(args)}
    <Timeline>
      {@render dummyChild()}
      <Timeline.HiddenEvents {...args} />
      {@render dummyChild()}
    </Timeline>
  {/snippet}
</Story>
