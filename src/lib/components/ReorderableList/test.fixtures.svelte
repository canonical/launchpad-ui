<script lang="ts" module>
  import { Item } from "./common/Item/index.js";
  import type { ItemData } from "./common/Item/types.js";

  export type TestItem = {
    id: string;
    name: string;
  };

  export const threeItems: TestItem[] = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Bravo" },
    { id: "c", name: "Charlie" },
  ];

  export { itemSnippet };
</script>

{#snippet itemSnippet(props: ItemData<TestItem>, renderedInOverlay: boolean)}
  <Item {...props} data-rendered-in-overlay={String(renderedInOverlay)}>
    <span>{props.item.name}</span>
  </Item>
{/snippet}
