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
      // children: {
      //   description: "o",
      //   table: { type: { summary: "Snippet<[]>" } },
      // },
      ...modifiersControl(selectInputModifiers),
    },
  });

  let value = $state("");
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
