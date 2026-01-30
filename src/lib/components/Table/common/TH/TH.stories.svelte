<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Table } from "../../index.js";
  import TH from "./TH.svelte";

  const { Story } = defineMeta({
    title: "Components/Table/TH",
    tags: ["autodocs"],
    component: TH,
    argTypes: {
      sortSwitcher: { control: false },
    },
  });
</script>

<Story name="With Sort Button">
  {#snippet template({ sortSwitcher: _, ...args })}
    <Table>
      <thead>
        <tr>
          <Table.TH {...args}>
            Header
            {#snippet sortSwitcher()}
              <Table.TH.SortButton aria-label="Sort" />
            {/snippet}
          </Table.TH>
        </tr>
      </thead>
    </Table>
  {/snippet}
</Story>

<Story name="With Sort Link">
  {#snippet template({ sortSwitcher: _, ...args })}
    <Table>
      <thead>
        <tr>
          <Table.TH {...args}>
            Header
            {#snippet sortSwitcher()}
              <Table.TH.SortLink aria-label="Sort" href="#" />
            {/snippet}
          </Table.TH>
        </tr>
      </thead>
    </Table>
  {/snippet}
</Story>
