<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import MulticolorIcon from "./MulticolorIcon.svelte";
  import { iconNames } from "./iconNames.js";

  const { Story } = defineMeta({
    title: "MulticolorIcon",
    tags: ["autodocs"],
    component: MulticolorIcon,
    argTypes: {
      name: {
        control: { type: "select" },
        options: [...iconNames].sort((a, b) => a.localeCompare(b)),
      },
    },
  });
</script>

<Story name="Default" args={{ name: "error" }} />
