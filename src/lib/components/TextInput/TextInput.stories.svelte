<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { modifiersControl } from "$lib/modifiers/index.js";
  import TextInput from "./TextInput.svelte";
  import { textInputModifiers } from "./modifiers.js";

  const { Story } = defineMeta({
    title: "Components/TextInput",
    tags: ["autodocs"],
    component: TextInput,
    argTypes: {
      disabled: {
        control: { type: "boolean" },
        description: "Disables the text input, preventing user interaction.",
        table: {
          type: { summary: "boolean" },
          category: "properties",
        },
      },
      placeholder: {
        control: { type: "text" },
        description: "The placeholder text for the input.",
        table: {
          category: "properties",
        },
      },
      ...modifiersControl(textInputModifiers),
    },
    args: {
      placeholder: "Enter text...",
    },
  });
</script>

<script lang="ts">
  const severityModifiers = [
    undefined,
    "negative",
    "caution",
    "positive",
  ] as const;

  const densities = [undefined, "dense"] as const;

  let value = $state("Hello world");
</script>

<!-- As an input, it requires a `<label>` associated with it. -->

<Story name="Default" />

<Story name="Severities">
  {#snippet template(args)}
    <div
      style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;"
    >
      {#each severityModifiers as severity (severity)}
        <TextInput
          {...args}
          modifiers={{ ...(args.modifiers || {}), severity }}
          placeholder={severity || "default"}
        />
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="Densities">
  {#snippet template(args)}
    <div
      style="display: flex; flex-direction: column; gap: 0.5rem; align-items: flex-start;"
    >
      {#each densities as density (density)}
        <TextInput
          {...args}
          modifiers={{ ...(args.modifiers || {}), density }}
          placeholder={density || "default"}
        />
      {/each}
    </div>
  {/snippet}
</Story>

<Story name="With bound value">
  {#snippet template(args)}
    <!-- 
      <script lang="ts">
        let value = $state("Hello world");
      </script>
    -->
    <TextInput {...args} bind:value />
    <span style="margin-inline-start: 0.5rem;">Current value: {value}</span>
  {/snippet}
</Story>

<Story name="Invalid state" args={{ required: true, value: "" }} />
