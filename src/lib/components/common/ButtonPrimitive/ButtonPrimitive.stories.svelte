<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import ButtonPrimitive from "./ButtonPrimitive.svelte";

  const { Story } = defineMeta({
    title: "Primitives/ButtonPrimitive",
    tags: ["autodocs"],
    component: ButtonPrimitive,
    argTypes: {
      type: {
        table: { disable: true },
      },
      ref: {
        table: { disable: true },
      },
    },
  });
</script>

<Story name="As button">ButtonPrimitive</Story>

<Story name="As anchor" args={{ href: "https://example.com" }}>
  ButtonPrimitive
</Story>

<Story name="Disabled button" args={{ disabled: true }}>ButtonPrimitive</Story>

<Story
  name="Disabled anchor"
  args={{ href: "https://example.com", disabled: true }}
>
  ButtonPrimitive
</Story>
