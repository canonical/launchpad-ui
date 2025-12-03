<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Chip } from "../Chip/index.js";
  import { DateTime } from "../DateTime/index.js";
  import { UserChip } from "../UserChip/index.js";
  import { DescriptionList } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/DescriptionList",
    tags: ["autodocs"],
    component: DescriptionList,
  });
</script>

<Story name="Default">
  {#snippet template()}
    <DescriptionList>
      <DescriptionList.Item term="ID">134</DescriptionList.Item>
      <DescriptionList.Item term="Requested by">
        <UserChip userName="Jane Doe" />
      </DescriptionList.Item>
      <DescriptionList.Item term="Created">
        <DateTime date="2023-10-01T12:00:00Z" absolute={true} />
      </DescriptionList.Item>
      <DescriptionList.Item term="Status">
        <Chip value="Active" readonly severity="positive" />
      </DescriptionList.Item>
    </DescriptionList>
  {/snippet}
</Story>

<Story name="With vertical items">
  {#snippet template()}
    <DescriptionList>
      <DescriptionList.Item term="ID" orientation="vertical"
        >134</DescriptionList.Item
      >
      <DescriptionList.Item term="Requested by" orientation="vertical">
        <UserChip userName="Jane Doe" />
      </DescriptionList.Item>
      <DescriptionList.Item term="Created" orientation="vertical">
        <DateTime date="2023-10-01T12:00:00Z" absolute={true} />
      </DescriptionList.Item>
      <DescriptionList.Item term="Status" orientation="vertical">
        <Chip value="Active" readonly severity="positive" />
      </DescriptionList.Item>
    </DescriptionList>
  {/snippet}
</Story>

<Story name="With mixed orientations" tags={["!autodocs"]}>
  {#snippet template()}
    <DescriptionList>
      <DescriptionList.Item term="ID">134</DescriptionList.Item>
      <DescriptionList.Item term="Requested by" orientation="vertical">
        <UserChip userName="Jane Doe" />
      </DescriptionList.Item>
      <DescriptionList.Item term="Created">
        <DateTime date="2023-10-01T12:00:00Z" absolute={true} />
      </DescriptionList.Item>
      <DescriptionList.Item term="Status" orientation="vertical">
        <Chip value="Active" readonly severity="positive" />
      </DescriptionList.Item>
    </DescriptionList>
  {/snippet}
</Story>
