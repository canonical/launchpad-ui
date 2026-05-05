<script module lang="ts">
  import {
    Checkbox,
    Radio,
    UserAvatar,
  } from "@canonical/svelte-ds-app-launchpad";
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Item from "./Item.svelte";

  const { Story } = defineMeta({
    title: "Components/Accordion/Item",
    tags: ["autodocs"],
    component: Item,
    argTypes: {
      heading: { control: "text" },
      children: { control: false },
      open: { control: { type: "boolean" }, defaultValue: false },
    },
  });
</script>

<Story name="Default" args={{ heading: "Standalone item" }}>
  `Accordion.Item` works on its own without a parent `Accordion`.
</Story>

<Story name="Snippet heading" argTypes={{ heading: { control: false } }}>
  {#snippet template({ heading: _, children: __, ...args })}
    <Item {...args}>
      {#snippet heading()}
        <strong>Heading</strong> with rich content
      {/snippet}
      Pass a snippet when the heading needs richer markup than plain text.
    </Item>
  {/snippet}
</Story>

<Story
  name="With a very long heading"
  args={{
    heading:
      "Incredibly long content showing, that if the text wraps, the chevron is still vertically aligned to the first line of the heading. When I say incredibly long, I mean it. This is just filler text to demonstrate the wrapping behavior.",
  }}
>
  The chevron is always aligned to the first line of the heading, even if it
  wraps onto multiple lines.
</Story>

<Story
  name="With custom heading line height"
  argTypes={{ heading: { control: false } }}
>
  {#snippet template({ heading: _, children: __, ...args })}
    <Item {...args} --line-height-accordion-item-heading="2rem">
      {#snippet heading()}
        <p style="font-size: 1.5rem; line-height: 2rem;">
          Heading with custom line-height.
        </p>
      {/snippet}
      If your heading has custom line-height or spacing, you can set
      <code>--line-height-accordion-item-heading</code> to make sure the chevron is
      properly aligned.
    </Item>
  {/snippet}
</Story>

<Story
  name="Content breakout"
  args={{ heading: "Content breakout", contentBreakout: true, open: true }}
>
  {#snippet template({ children: _, ...args })}
    <Item {...args}>
      <p style="grid-column: content">
        When you need more control over the content layout, you can set <code
          >contentBreakout</code
        >
        to make the content break out of the default <code>content</code> grid-track.
        This allows special layouts e.g., list-like content to align its markers (checkboxes,
        icons, etc.) with the chevron, while keeping the main body of the content
        aligned with the heading and any other items in the accordion.
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
    </Item>
  {/snippet}
</Story>

<Story
  name="With a list of checkboxes and radios"
  args={{
    heading: "With a list of checkboxes and radios",
    contentBreakout: true,
    open: true,
  }}
>
  <p style="grid-column: content; margin-block-end: 0.5rem;">
    Notice how the checkboxes and radios are aligned with the chevron, while the
    label text is aligned with the heading of the item.
  </p>
  <ol style:display="contents">
    {#each ["Checkbox 1", "Checkbox 2", "Checkbox 3"] as option (option)}
      <li style="display: contents;">
        <Checkbox
          id={option}
          name="checkbox-group"
          style="grid-column: marker;"
        />
        <label for={option} style="grid-column: content;">{option}</label>
      </li>
    {/each}
  </ol>
  <ol style="display: contents;">
    {#each ["Radio 1", "Radio 2", "Radio 3"] as option (option)}
      <li style="display: contents;">
        <Radio id={option} name="radio-group" style="grid-column: marker;" />
        <label for={option} style="grid-column: content;">{option}</label>
      </li>
    {/each}
  </ol>
  <p style="grid-column: content; margin-block: 0.5rem;">
    You can also use subgrid in your own content, for example to apply hover
    styles to the entire row of a list item, while keeping the marker aligned
    with the chevron.
  </p>
  <ul style="display: contents;">
    <style>
      .spanning-label {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        align-items: center;
        cursor: pointer;
        padding: var(--lp-dimension-spacing-block-xs);

        &:hover {
          background-color: var(--lp-color-background-hover);
        }
      }
    </style>
    {#each ["List item 1", "List item 2", "List item 3"] as option (option)}
      <li style="display: contents;">
        <label class="spanning-label">
          <Checkbox style="grid-column: marker;" />
          <span style="grid-column: content;">
            {option} - Hover anywhere on the row to see the effect, not just on the
            text.
          </span>
        </label>
      </li>
    {/each}
  </ul>
</Story>

<Story
  name="Content breakout with bigger markers"
  args={{
    heading: "Content breakout with bigger markers",
    contentBreakout: true,
    open: true,
  }}
>
  {#snippet template({ children: _, ...args })}
    <Item {...args} --min-size-accordion-marker-track="2rem">
      <p style="grid-column: content; margin-block-end: 0.5rem;">
        If your list markers are bigger than the chevron, you can prevent
        horizontal content jump on expand/collapse by defining a stable minimum
        marker track size using <code>--min-size-accordion-marker-track</code>.
      </p>
      <ol style:display="contents">
        {#each ["John Dough", "Maria Smith", "Alice Johnson"] as userName (userName)}
          <li style="display: contents;">
            <UserAvatar
              size="large"
              {userName}
              userAvatarUrl="https://assets.ubuntu.com/v1/fca94c45-snap+icon.png"
              style="grid-column: marker;"
            />
            <span style="grid-column: content;">{userName}</span>
          </li>
        {/each}
      </ol>
    </Item>
  {/snippet}
</Story>
