<!-- @canonical/generator-ds 0.10.0-experimental.2 -->

<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import IconMarker from "./IconMarker.svelte";

  const { Story } = defineMeta({
    title: "Components/Timeline/IconMarker",
    tags: ["autodocs"],
    component: IconMarker,
    argTypes: {
      name: { control: { type: "select" } },
    },
  });
</script>

<Story name="Default" args={{ name: "flag" }} />
