<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Button from "./Button.svelte";

  const { Story } = defineMeta({
    title: "Button",
    tags: ["autodocs"],
    component: Button,
    argTypes: {
      disabled: {
        control: "boolean",
        description: "Whether the button is disabled",
        type: { name: "boolean", required: false },
      },
      type: {
        table: {
          disable: true,
        },
      },
    },
  });
</script>

<Story name="Default">Button</Story>
<Story name="Default Disabled" args={{ disabled: true }}>Button</Story>
<Story name="Default Loading" args={{ loading: true }}>Button</Story>
<Story name="Default Disabled Loading" args={{ disabled: true, loading: true }}
  >Button</Story
>

<Story name="Brand" args={{ appearance: "brand" }}>Button</Story>
<Story name="Brand Disabled" args={{ appearance: "brand", disabled: true }}
  >Button</Story
>
<Story name="Brand Loading" args={{ appearance: "brand", loading: true }}
  >Button</Story
>
<Story
  name="Brand Disabled Loading"
  args={{ appearance: "brand", disabled: true, loading: true }}>Button</Story
>

<Story name="Primary" args={{ appearance: "primary" }}>Button</Story>
<Story name="Primary Disabled" args={{ appearance: "primary", disabled: true }}
  >Button</Story
>
<Story name="Primary Loading" args={{ appearance: "primary", loading: true }}
  >Button</Story
>
<Story
  name="Primary Disabled Loading"
  args={{ appearance: "primary", disabled: true, loading: true }}>Button</Story
>

<Story name="Negative" args={{ appearance: "negative" }}>Button</Story>
<Story
  name="Negative Disabled"
  args={{ appearance: "negative", disabled: true }}>Button</Story
>
<Story name="Negative Loading" args={{ appearance: "negative", loading: true }}
  >Button</Story
>
<Story
  name="Negative Disabled Loading"
  args={{ appearance: "negative", disabled: true, loading: true }}>Button</Story
>

<Story name="Base" args={{ appearance: "base" }}>Button</Story>
<Story name="Base Disabled" args={{ appearance: "base", disabled: true }}
  >Button</Story
>
<Story name="Base Loading" args={{ appearance: "base", loading: true }}
  >Button</Story
>
<Story
  name="Base Disabled Loading"
  args={{ appearance: "base", disabled: true, loading: true }}>Button</Story
>

<Story name="Dense" args={{ size: "dense" }}>Button</Story>
<Story name="Small" args={{ size: "small" }}>Button</Story>
