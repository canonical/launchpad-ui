<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import TextInputPrimitive from "./TextInputPrimitive.svelte";

  const { Story } = defineMeta({
    title: "Primitives/TextInputPrimitive",
    tags: ["autodocs"],
    component: TextInputPrimitive,
    argTypes: {
      ref: {
        table: { disable: true },
      },
      value: {
        control: "text",
        table: { type: { summary: "string" }, category: "properties" },
      },
      placeholder: {
        control: { type: "text" },
        table: {
          type: { summary: "string" },
          category: "properties",
        },
      },
      disabled: {
        control: { type: "boolean" },
        table: {
          type: { summary: "boolean" },
          category: "properties",
        },
      },
    },
    args: {
      placeholder: "Enter text...",
    },
  });
</script>

<Story name="Default" />
<Story name="Disabled" args={{ disabled: true }} />
<Story name="Invalid state" args={{ required: true, value: "" }} />
