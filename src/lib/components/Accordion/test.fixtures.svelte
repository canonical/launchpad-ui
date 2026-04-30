<script lang="ts" module>
  import { Item } from "./common/Item/index.js";

  const itemAHeadingText = "Section A";
  const itemBHeadingText = "Section B";
  const itemCHeadingText = "Section C";
  const itemAContentText = "Content A";
  const itemBContentText = "Content B";
  const itemCContentText = "Content C";

  export {
    itemAContentText,
    itemAHeadingText,
    itemBContentText,
    itemBHeadingText,
    itemCContentText,
    itemCHeadingText,
    threeItems,
    twoItems,
  };
</script>

{#snippet twoItems()}
  <Item data-testid="item-a">
    {#snippet heading()}{itemAHeadingText}{/snippet}
    {itemAContentText}
  </Item>
  <Item data-testid="item-b">
    {#snippet heading()}{itemBHeadingText}{/snippet}
    {itemBContentText}
  </Item>
{/snippet}

{#snippet threeItems()}
  <Item data-testid="item-a">
    {#snippet heading()}{itemAHeadingText}{/snippet}
    {itemAContentText}
  </Item>
  <Item data-testid="item-b">
    {#snippet heading()}{itemBHeadingText}{/snippet}
    {itemBContentText}
  </Item>
  <Item data-testid="item-c">
    {#snippet heading()}{itemCHeadingText}{/snippet}
    {itemCContentText}
  </Item>
{/snippet}
