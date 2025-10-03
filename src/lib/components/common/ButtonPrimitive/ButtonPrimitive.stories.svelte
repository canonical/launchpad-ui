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
    },
  });
</script>

<Story name="As button" args={{ as: "button" }}>ButtonPrimitive</Story>

<Story name="As anchor" args={{ as: "a", href: "https://example.com" }}>
  ButtonPrimitive
</Story>

<Story name="Disabled button" args={{ as: "button", disabled: true }}>
  ButtonPrimitive
</Story>

<Story
  name="Disabled anchor"
  args={{ as: "a", href: "https://example.com", disabled: true }}
>
  ButtonPrimitive
</Story>
