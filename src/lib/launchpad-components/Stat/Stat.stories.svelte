<script module lang="ts">
  import { ContentLayout } from "@canonical/svelte-ds-app";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Stat } from "./index.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/Stat",
    tags: ["autodocs"],
    component: Stat,
  });
</script>

<Story name="Default">
  {#snippet template()}
    <Stat>
      <Stat.Item term="Open critical bugs" description="1" marked></Stat.Item>
      <Stat.Item term="Open bugs" description="58"></Stat.Item>
      <Stat.Item term="In progress" description="16"></Stat.Item>
    </Stat>
  {/snippet}
</Story>

<Story name="Responsive styling in grid wrapper">
  {#snippet template()}
    <ContentLayout>
      <div class="grid-rectangle element1">Element 1</div>
      <div class="grid-rectangle element2">Element 2</div>
      <div class="grid-rectangle element3">Element 3</div>
      <div class="spacer"></div>
      <Stat class="storybook-stat">
        <Stat.Item term="Images built" description="35/41"></Stat.Item>
        <div class="small-screen-wrapper">
          <Stat.Item term="Failed to build" description="2" marked></Stat.Item>
          <Stat.Item term="Building" description="4"></Stat.Item>
        </div>
      </Stat>

      <div class="spacer"></div>
      <Stat>
        <Stat.Item term="Images passed tests" description="22/35"></Stat.Item>
        <div class="small-screen-wrapper">
          <Stat.Item term="Failed tests" description="3" marked></Stat.Item>
          <Stat.Item term="Testing" description="10"></Stat.Item>
        </div>
      </Stat>

      <div class="spacer"></div>
      <Stat>
        <Stat.Item term="Open critical bugs" description="1" marked></Stat.Item>
        <div class="small-screen-wrapper">
          <Stat.Item term="Open bugs" description="58"></Stat.Item>
          <Stat.Item term="In progress" description="16"></Stat.Item>
        </div>
      </Stat>
    </ContentLayout>
  {/snippet}
</Story>

<style>
  .small-screen-wrapper {
    display: block;
    grid-column: span 2;
  }

  .grid-rectangle {
    min-height: 80px;
    border: 1px solid currentColor;
    display: grid;
    place-items: center;
  }

  .element1,
  .element2,
  .element3 {
    grid-column: span 4;
  }

  @media (min-width: 768px) {
    .spacer,
    .element1,
    .element2 {
      grid-column: span 2;
    }

    .small-screen-wrapper {
      display: contents;
    }
  }

  @media (min-width: 1280px) {
    .spacer {
      display: none;
    }

    .element1 {
      grid-column: span 4;
    }
  }
</style>
