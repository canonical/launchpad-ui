<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Switch from "./Switch.svelte";
  import type { SwitchProps } from "./types.js";

  const { Story } = defineMeta({
    title: "Switch",
    tags: ["autodocs"],
    component: Switch,
    render,
    argTypes: {
      checked: {
        control: { type: "boolean" },
        description: "Whether the switch is on or off\n\n**@bindable**",
        type: "boolean",
        table: {
          defaultValue: { summary: "false" },
        },
      },
      disabled: {
        control: { type: "boolean" },
        description: "Disables the switch, preventing user interaction",
        type: "boolean",
        defaultValue: false,
      },
    },
  });
</script>

<!-- As an input control, it requires a `<label>` associated with it. -->
{#snippet render(args: SwitchProps)}
  <label style="display: flex; align-items: center; gap: 0.5rem;">
    <Switch {...args} />
    Toggle me
  </label>
{/snippet}

<Story name="Default" />
<Story name="Checked" args={{ checked: true }} />
<Story name="Disabled" args={{ disabled: true }} />
<Story name="Disabled checked" args={{ checked: true, disabled: true }} />
