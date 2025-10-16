<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { modifiersControl } from "$lib/modifiers";
  import Select from "./Select.svelte";
  import { selectInputModifiers } from "./modifiers";

  const { Story } = defineMeta({
    title: "Components/Select",
    tags: ["autodocs"],
    component: Select,
    argTypes: {
      ref: {
        table: { disable: true },
      },
      disabled: {
        control: { type: "boolean" },
        description: "Disables the select, preventing user interaction",
        type: "boolean",
        defaultValue: false,
        table: {
          category: "properties",
        },
      },
      value: {
        description: "The value of the select.\n\n**@bindable**",
        table: {
          type: {
            detail: "is array if `multiple` is true",
            summary: "any | any[]",
          },
          category: "properties",
        },
      },
      multiple: {
        control: { type: "boolean" },
        description: "Whether the select allows multiple selections",
        type: "boolean",
        defaultValue: false,
        table: {
          category: "properties",
        },
      },
      ...modifiersControl(selectInputModifiers),
    },
  });

  let value = $state<string>();
  let values = $state<string[]>([]);
</script>

<Story name="Default">
  {#snippet template(args)}
    <Select {...args}>
      <option value="" disabled selected>Select an option</option>
      <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
      <option value="bionic-beaver">Bionic Beaver</option>
      <option value="xenial-xerus">Xenial Xerus</option>
    </Select>
  {/snippet}
</Story>

<Story name="Single option">
  <!--
    <script lang="ts">
      let value = $state("");
    </script>
  -->
  {#snippet template(args)}
    <div class="row">
      <div>
        <label for="single-distro">Choose a distro</label>
        <br />
        <Select bind:value id="single-distro" {...args}>
          <option value="" disabled selected>Select an option</option>
          <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
          <option value="bionic-beaver">Bionic Beaver</option>
          <option value="xenial-xerus">Xenial Xerus</option>
        </Select>
      </div>
      <div>Current value: <code>{value}</code></div>
    </div>
  {/snippet}
</Story>

<Story name="Multiple options" args={{ multiple: true }}>
  <!-- 
    <script lang="ts">
      let values = $state<string[]>([]);
    </script>
  -->
  {#snippet template(args)}
    <div class="row">
      <div>
        <label for="multiple-distros">Choose your favorite distros</label>
        <br />
        <Select bind:value={values} multiple id="multiple-distros" {...args}>
          <option value="" disabled>Select...</option>
          <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
          <option value="bionic-beaver">Bionic Beaver</option>
          <option value="xenial-xerus">Xenial Xerus</option>
        </Select>
      </div>
      <div>Current value: <code>{JSON.stringify(values)}</code></div>
    </div>
  {/snippet}
</Story>

<Story name="Disabled" args={{ disabled: true }}>
  {#snippet template(args)}
    <Select {...args}>
      <option value="" disabled selected>Select an option</option>
      <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
    </Select>
  {/snippet}
</Story>

<Story name="Invalid" args={{ required: true, value: "" }}>
  {#snippet template(args)}
    <Select {...args}>
      <option value="" disabled selected>Select an option</option>
      <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
    </Select>
  {/snippet}
</Story>

<Story name="With group options">
  {#snippet template(args)}
    <Select {...args}>
      <option value="" disabled selected>Select an option</option>
      <optgroup label="Ubuntu Linux">
        <option value="cosmic-cuttlefish">Cosmic Cuttlefish</option>
        <option value="bionic-beaver">Bionic Beaver</option>
        <option value="xenial-xerus">Xenial Xerus</option>
      </optgroup>
      <optgroup label="Windows">
        <option value="windows-10">Windows 10</option>
        <option value="windows-11">Windows 11</option>
      </optgroup>
    </Select>
  {/snippet}
</Story>
