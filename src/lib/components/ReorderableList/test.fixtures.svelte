<script lang="ts" module>
  import { Item } from "./common/Item/index.js";
  import type { ReorderableListItemSnippetProps } from "./types.js";

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

{#snippet itemSnippet(props: ReorderableListItemSnippetProps<TestItem>)}
  <Item {...props}>
    <span>{props.item.name}</span>
  </Item>
{/snippet}
