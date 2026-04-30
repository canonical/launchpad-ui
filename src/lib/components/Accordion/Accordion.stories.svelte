<script module lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
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
      exclusive: {
        control: { type: "boolean" },
        description:
          "Only one item open at a time. Uses native `<details name>`.",
        defaultValue: false,
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
      <Accordion.Item heading="Section A">
        Opening another section will close this one.
      </Accordion.Item>
      <Accordion.Item heading="Section B">
        Only one section can be open at a time.
      </Accordion.Item>
      <Accordion.Item heading="Section C">
        Behavior is implemented natively via the `name` attribute.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>

<Story name="Custom heading">
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item>
        {#snippet heading()}
          <strong>Heading</strong> with rich content
          <span style="color: var(--lp-color-text-muted);">(3 items)</span>
        {/snippet}
        Pass a snippet when the heading needs richer markup than plain text.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>

<Story name="Bindable open">
  {#snippet template({ children: _, ...args })}
    <!--
      <script lang="ts">
        let openControlled = $state(false);
      </script>
    -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <Button onclick={() => (openControlled = !openControlled)}>
        Toggle from outside ({openControlled ? "open" : "closed"})
      </Button>
      <Accordion {...args}>
        <Accordion.Item bind:open={openControlled} heading="Bindable item">
          The `open` prop is two-way bindable.
        </Accordion.Item>
      </Accordion>
    </div>
  {/snippet}
</Story>

<Story name="Keyboard navigation">
  {#snippet template({ children: _, ...args })}
    <Accordion {...args}>
      <Accordion.Item heading="First">
        Focus a heading, then press <kbd>ArrowDown</kbd>/<kbd>ArrowUp</kbd>
        to move between headings, <kbd>Home</kbd>/<kbd>End</kbd> to jump to the
        first/last, and <kbd>Enter</kbd>/<kbd>Space</kbd> to toggle.
      </Accordion.Item>
      <Accordion.Item heading="Second">
        Navigation wraps around at both ends.
      </Accordion.Item>
      <Accordion.Item heading="Third">
        Implements the WAI-ARIA Accordion Pattern.
      </Accordion.Item>
    </Accordion>
  {/snippet}
</Story>
