<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Icon from "../Icon/Icon.svelte";
  import Button from "./Button.svelte";

  const { Story } = defineMeta({
    title: "Components/Button",
    tags: ["autodocs"],
    component: Button,
    argTypes: {
      children: {
        description: "The content of the button",
        table: {
          type: { summary: "Snippet<[]>" },
        },
      },
      disabled: {
        control: "boolean",
        description: "Whether the button is disabled",
        type: { name: "boolean", required: false },
      },
    },
  });
</script>

<script lang="ts">
  import { SEMANTIC_MODIFIERS } from "$lib/modifiers";

  const severityModifiers = [
    "base",
    undefined,
    "brand",
    "positive",
    "negative",
  ] as const;
  let loading = $state(false);
  const toggleLoading = () => {
    loading = !loading;
    setTimeout(() => {
      loading = !loading;
    }, 2000);
  };
</script>

<Story name="Default">Default button</Story>

<Story name="Severities">
  {#snippet template(args)}
    <div class="row">
      {#each severityModifiers as modifier (modifier)}
        <Button {...args} modifiers={[modifier, ...(args?.modifiers ?? [])]}>
          {modifier || "default"}
        </Button>
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Densities">
  {#snippet template(args)}
    {#each [undefined, ...SEMANTIC_MODIFIERS.DENSITY] as modifier (modifier)}
      <div class="row">
        <Button
          {...args}
          modifiers={[modifier, "positive", ...(args?.modifiers ?? [])]}
        >
          {#snippet iconLeft()}
            <Icon name="success-filled" />
          {/snippet}
        </Button>
        <Button {...args} modifiers={[modifier, ...(args?.modifiers ?? [])]}>
          Icon before text
          {#snippet iconLeft()}
            <Icon name="plus" />
          {/snippet}
        </Button>
        <Button {...args} modifiers={[modifier, ...(args?.modifiers ?? [])]}>
          {modifier || "default"} icon after
          {#snippet iconRight()}
            <Icon name="success-filled" />
          {/snippet}
        </Button>
        <br />
        <br />
      </div>
    {/each}
  {/snippet}
</Story>

<Story name="Loading">
  {#snippet template(args)}
    <div class="row">
      {#each severityModifiers as modifier (modifier)}
        <Button
          {...args}
          modifiers={[modifier, ...(args?.modifiers ?? [])]}
          onclick={toggleLoading}
          {loading}>{modifier || "default"}</Button
        >
      {/each}
      <Button {...args} loading>Default</Button>
      <br />
      <br />
    </div>
    <p style="font-size: 12px; color: var(--color-text-secondary);">
      Click the button to toggle the loading state.
    </p>
  {/snippet}
</Story>

<Story name="With left icon">
  {#snippet template(args)}
    <Button {...args}>
      Default
      {#snippet iconLeft()}
        <Icon name="applications" />
      {/snippet}
    </Button>
  {/snippet}
</Story>

<Story name="With right icon">
  {#snippet template(args)}
    <Button {...args}>
      Default
      {#snippet iconRight()}
        <Icon name="chevron-down" />
      {/snippet}
    </Button>
  {/snippet}
</Story>

<Story name="Icon only">
  {#snippet template(args)}
    <Button {...args} modifiers={["positive", ...(args?.modifiers ?? [])]}>
      {#snippet iconLeft()}
        <Icon name="fork" />
      {/snippet}
    </Button>
  {/snippet}
</Story>

<Story name="Disabled button" tags={["!autodocs"]}>
  {#snippet template(args)}
    <Button {...args} disabled>Disabled</Button>
  {/snippet}
</Story>

<Story name="Disabled loading button" tags={["!autodocs"]}>
  {#snippet template(args)}
    <Button {...args} disabled loading>Disabled loading</Button>
  {/snippet}
</Story>

<Story name="Icon left, text and right icon" tags={["!autodocs"]}>
  {#snippet template(args)}
    <Button {...args}>
      {#snippet iconLeft()}
        <Icon name="fork" />
      {/snippet}
      Default
      {#snippet iconRight()}
        <Icon name="chevron-down" />
      {/snippet}
    </Button>
  {/snippet}
</Story>

<Story name="Icon left right icon" tags={["!autodocs"]}>
  {#snippet template(args)}
    <Button {...args}>
      {#snippet iconLeft()}
        <Icon name="fork" />
      {/snippet}
      {#snippet iconRight()}
        <Icon name="chevron-down" />
      {/snippet}
    </Button>
  {/snippet}
</Story>
