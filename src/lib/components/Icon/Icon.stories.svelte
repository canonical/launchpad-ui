<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Icon from "./Icon.svelte";
  import { iconNames } from "./iconNames.js";

  const { Story } = defineMeta({
    title: "Icon",
    tags: ["autodocs"],
    component: Icon,
    argTypes: {
      name: {
        control: { type: "select" },
        options: [...iconNames].sort((a, b) => a.localeCompare(b)),
      },
    },
  });
</script>

<Story name="Default" args={{ name: "edit" }} />

<Story
  name="With custom color"
  args={{ name: "edit", style: "color: #ff6347;" }}
/>
