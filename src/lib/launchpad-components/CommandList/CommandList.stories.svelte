<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { CommandList } from "./index.js";

  const { Story } = defineMeta({
    title: "Launchpad Components/CommandList",
    tags: ["autodocs"],
    component: CommandList,
  });
</script>

<Story name="Default" asChild>
  <CommandList>
    <CommandList.Command
      status="EXECUTING"
      command="command config -r -d -c &quot;a very long text of multiple words that causes the component to demonstrate its wrapping behavior&quot; | grep &quot;https://example.com/a/very/long/url/that/demonstrates/how/a/single/word/would/be/broken/into/multiple/lines/if/necessary&quot; && echo &quot;done!&quot;"
      href="#line-862"
    />
    <CommandList.Command
      status="PENDING"
      command="another-command --with --various --flags"
    />
    <CommandList.Command
      status="FINISHED"
      command="final-command arg1 arg2 arg3"
      href="#line-900"
    />
  </CommandList>
</Story>
