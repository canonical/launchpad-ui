<script module lang="ts">
  import { Button, Chip } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Accordion } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Accordion",
    tags: ["autodocs"],
    component: Accordion,
    argTypes: {
      children: {
        control: false,
      },
    },
  });

  let openControlled = $state(false);
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item heading="Description">
        Ubuntu is the modern, open source operating system on Linux for the
        enterprise server, desktop, cloud, and IoT.
      </Accordion.Item>
      <Accordion.Item open heading="Compatibility">
        Ubuntu runs on all major architectures and a wide range of hardware,
        from desktops to data-center servers.
      </Accordion.Item>
      <Accordion.Item heading="Support">
        Long-term support releases are maintained for five years.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>

<Story name="Exclusive" args={{ exclusive: true }}>
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item heading="Section A" open>
        Opening another section will close this one.
      </Accordion.Item>
      <Accordion.Item heading="Section B">
        Only one section can be open at a time.
      </Accordion.Item>
      <Accordion.Item heading="Section C">
        Behavior is implemented natively via the <code>name</code> attribute.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>

<Story name="With different types of content">
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item open>
        {#snippet heading()}
          <strong>Heading</strong> with rich content
          <span style="color: var(--lp-color-text-muted);">(3 items)</span>
        {/snippet}
        Pass a snippet when the heading needs richer markup than plain text.
      </Accordion.Item>
      <Accordion.Item
        open
        heading="Incredibly long content showing, that if the text wraps, the chevron is still vertically aligned to the first line of the heading. When I say incredibly long, I mean it. This is just filler text to demonstrate the wrapping behavior."
      >
        The content can be <Chip value="anything" />, not just plain text.
      </Accordion.Item>
      <Accordion.Item open --line-height-accordion-item-heading="2rem">
        {#snippet heading()}
          <p style="font-size: 1.5rem; line-height: 2rem;">
            Heading with custom line-height.
          </p>
        {/snippet}
        If your heading has custom line-height or spacing, you can set
        <code>--line-height-accordion-item-heading</code> to make sure the chevron
        is properly aligned.
      </Accordion.Item>
      <Accordion.Item open heading="With content breakout" contentBreakout>
        <p style="grid-column: content;">
          When you need more control over the content layout, you can set <code
            >contentBreakout</code
          >
          to make the content break out of the default <code>content</code> grid-track.
          This allows special layouts e.g., list-like content to align its markers
          (checkboxes, icons, etc.) with the chevron, while keeping the main body
          of the content aligned with the heading and any other items in the accordion.
        </p>
        <p style="grid-column: content; margin-block: 0.5rem;">
          There are two column grid-tracks that you can use to align content
          inside the item:
        </p>
        <ol style="display: contents;">
          <li class="simple-list-item">
            <span><code>marker</code> - aligned with the chevron</span>
          </li>
          <li class="simple-list-item">
            <span>
              <code>content</code> - the main content area, aligned with other items
              in the accordion by default
            </span>
          </li>
          <style>
            .simple-list-item {
              display: contents;
              list-style: none;

              &::before {
                content: "•";
                grid-column: marker;
                justify-self: center;
              }

              span {
                grid-column: content;
              }
            }
          </style>
        </ol>
        <p style="grid-column: content; margin-block-start: 0.5rem;">
          See more examples in <code>Accordion.Item</code> stories.
        </p>
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>

<Story name="Bindable open" args={{ exclusive: true }}>
  {#snippet template({ children: _, ...args })}
    <!--
      <script lang="ts">
        let openControlled = $state(false);
      </script>
    -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <Button onclick={() => (openControlled = !openControlled)}>
        Toggle bindable item from outside ({openControlled ? "open" : "closed"})
      </Button>
      <Accordion {...args}>
        <Accordion.Item bind:open={openControlled} heading="Bindable item">
          The <code>open</code> prop is two-way bindable.
        </Accordion.Item>
        <Accordion.Item heading="Other item">
          This item can be opened and closed independently. The accordion is
          exclusive - opening this will reflect on the bindable state and close
          the first item.
        </Accordion.Item>
      </Accordion>
    </div>
  {/snippet}
</Story>

<Story name="Keyboard navigation">
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item heading="First" open>
        Focus a heading, then press <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd>
        to move between headings, <kbd>Home</kbd>/<kbd>End</kbd> to jump to the
        first/last, and <kbd>Enter</kbd>/<kbd>Space</kbd> to toggle.
      </Accordion.Item>
      <Accordion.Item heading="Second" open>
        Navigation wraps around at both ends.
      </Accordion.Item>
      <Accordion.Item heading="Third" open>
        Implements the WAI-ARIA Accordion Pattern.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>
