<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Textarea from "./Textarea.svelte";

  const { Story } = defineMeta({
    title: "components/Textarea",
    tags: ["autodocs"],
    component: Textarea,
  });
  let value = $state("");
</script>

<Story name="Default">
  {#snippet template(args)}
    <Textarea {...args} bind:value placeholder="Enter text..." />
    <br />
    <span style="margin-inline-start: 0.5rem;">{value}</span>
  {/snippet}
</Story>

<Story name="Disabled" args={{ placeholder: "Disabled...", disabled: true }} />

<Story name="Invalid" args={{ required: true, value: "" }} />
