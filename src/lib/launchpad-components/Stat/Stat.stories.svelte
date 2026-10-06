<script module lang="ts">
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
      <Stat.Item key="Open critical bugs">
        <span aria-hidden="true" class="dot"></span>1
      </Stat.Item>
      <Stat.Item key="Open bugs">58</Stat.Item>
      <Stat.Item key="In progress">16</Stat.Item>
    </Stat>
  {/snippet}
</Story>

<Story name="Possible styling in large wrapper">
  {#snippet template()}
    <div class="placeholder-box" style="width: 940px; min-height: 100px;">
      <div class="storybook-grid-large">
        <div class="grid-rectangle">Element 1</div>
        <div class="grid-rectangle">Element 2</div>
        <div class="grid-rectangle">Element 3</div>
        <div class="grid-rectangle">Element 4</div>
        <div class="grid-rectangle">Element 5</div>
        <Stat class="storybook-stat">
          <Stat.Item key="Images built">35/41</Stat.Item>
          <Stat.Item key="Failed to build"
            ><span aria-hidden="true" class="dot"></span>2</Stat.Item
          >
          <Stat.Item key="Building">4</Stat.Item>
        </Stat>

        <Stat class="storybook-stat">
          <Stat.Item key="Images passed tests">22/35</Stat.Item>
          <Stat.Item key="Failed tests"
            ><span aria-hidden="true" class="dot"></span>3</Stat.Item
          >
          <Stat.Item key="Testing">10</Stat.Item>
        </Stat>

        <Stat class="storybook-stat">
          <Stat.Item key="Open critical bugs">
            <span aria-hidden="true" class="dot"></span>1
          </Stat.Item>
          <Stat.Item key="Open bugs">58</Stat.Item>
          <Stat.Item key="In progress">16</Stat.Item>
        </Stat>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Possible styling in medium wrapper">
  {#snippet template()}
    <div class="placeholder-box" style="width: 768px; min-height: 100px;">
      <div class="storybook-grid-medium">
        <div class="grid-rectangle" style="grid-column: 1 / -1;">Element 1</div>
        <div class="grid-rectangle">Element 2</div>
        <div class="grid-rectangle">Element 3</div>
        <div class="grid-rectangle" style="grid-column: -3 / -1;">
          Element 4
        </div>
        <div aria-hidden="true"></div>
        <Stat
          style="
    grid-column: 2 / 5;
    grid-row: 3;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Images built">35/41</Stat.Item>
          <Stat.Item key="Failed to build"
            ><span aria-hidden="true" class="dot"></span>2</Stat.Item
          >
          <Stat.Item key="Building">4</Stat.Item>
        </Stat>

        <div aria-hidden="true"></div>
        <Stat
          style="
    grid-column: 2 / 5;
    grid-row: 4;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Images passed tests">22/35</Stat.Item>
          <Stat.Item key="Failed tests"
            ><span aria-hidden="true" class="dot"></span>3</Stat.Item
          >
          <Stat.Item key="Testing">10</Stat.Item>
        </Stat>

        <div aria-hidden="true"></div>
        <Stat
          style="
    grid-column: 2 / 5;
    grid-row: 5;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Open critical bugs"
            ><span aria-hidden="true" class="dot"></span>1</Stat.Item
          >
          <Stat.Item key="Open bugs">58</Stat.Item>
          <Stat.Item key="In progress">16</Stat.Item>
        </Stat>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Possible styling in small wrapper">
  {#snippet template()}
    <div class="placeholder-box" style="width: 390px; min-height: 100px;">
      <div class="storybook-grid-small">
        <Stat
          style="
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Images built">35/41</Stat.Item>
          <div style="display: grid; gap: var(--dimension-050);">
            <Stat.Item key="Failed to build"
              ><span aria-hidden="true" class="dot"></span>2</Stat.Item
            >
            <Stat.Item key="Building">4</Stat.Item>
          </div>
        </Stat>

        <Stat
          style="
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Images passed tests">22/35</Stat.Item>
          <div style="display: grid; gap: var(--dimension-050);">
            <Stat.Item key="Failed tests"
              ><span aria-hidden="true" class="dot"></span>3</Stat.Item
            >
            <Stat.Item key="Testing">10</Stat.Item>
          </div>
        </Stat>

        <Stat
          style="
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
  "
          class="storybook-stat"
        >
          <Stat.Item key="Open critical bugs"
            ><span aria-hidden="true" class="dot"></span>1</Stat.Item
          >
          <div style="display: grid; gap: var(--dimension-050);">
            <Stat.Item key="Open bugs">58</Stat.Item>
            <Stat.Item key="In progress">16</Stat.Item>
          </div>
        </Stat>
      </div>
    </div>
  {/snippet}
</Story>

<style>
  .placeholder-box {
    padding: 20px;
  }

  .storybook-grid-large {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 24px;

    :global(.storybook-stat) {
      margin-bottom: var(--dimension-300);

      > :global(.stat-item:first-child) {
        margin-bottom: var(--dimension-150);
      }
    }
  }

  .storybook-grid-medium {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: var(--dimension-200);

    :global(.storybook-stat) {
      border-top: 1px solid var(--color-border-muted);
      padding-top: var(--dimension-100);
    }
  }

  .storybook-grid-small {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--dimension-200);

    :global(.storybook-stat) {
      border-top: 1px solid var(--color-border-muted);
      padding-top: var(--dimension-100);
    }
  }

  .dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--color-icon-error-root, #b61928);
    vertical-align: middle;
    margin-right: var(--dimension-050);
  }

  .grid-rectangle {
    min-height: 80px;
    border: 1px solid currentColor;
    display: grid;
    place-items: center;
  }
</style>
