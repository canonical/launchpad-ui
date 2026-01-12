<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { CommandList } from "../../index.js";
  import Command from "./Command.svelte";

  const { Story } = defineMeta({
    title: "Launchpad Components/CommandList/Command",
    tags: ["autodocs"],
    component: Command,
    args: {
      status: "EXECUTING",
      command:
        'command config -r -d -c "some strings here" | grep "something" && echo "done!"',
      href: "#line-862",
    },
  });
</script>

<Story name="Default">
  {#snippet template(args)}
    <CommandList>
      <CommandList.Command {...args} />
    </CommandList>
  {/snippet}
</Story>
