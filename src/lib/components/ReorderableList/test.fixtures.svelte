<script lang="ts" module>
  export type TestItem = {
    id: string;
    name: string;
  };

  export const threeItems: TestItem[] = [
    { id: "a", name: "Alpha" },
    { id: "b", name: "Bravo" },
    { id: "c", name: "Charlie" },
  ];

  export { extraContentSnippet, itemSnippet };
</script>

{#snippet itemSnippet(item: TestItem)}
  <span>{item.name}</span>
{/snippet}

{#snippet extraContentSnippet(item: TestItem)}
  <span>Extra {item.name}</span>
{/snippet}
