<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { Pagination } from "./index.js";

  const { Story } = defineMeta({
    title: "Components/Pagination",
    tags: ["autodocs"],
    component: Pagination,
    argTypes: {
      leftGroup: { control: false },
      rightGroup: { control: false },
      children: { control: false },
    },
  });

  const totalItems = 435;
  let currentPage = $state(3);
  let itemsPerPage = $state(50);
  const numberOfPages = $derived(Math.ceil(totalItems / itemsPerPage));
</script>

<Story name="Default">
  {#snippet template({ leftGroup: _, rightGroup: __, children: ___, ...args })}
    <Pagination {...args}>
      {#snippet leftGroup()}
        <Pagination.ItemsPerPageSelect
          bind:value={
            () => itemsPerPage,
            (value) => {
              currentPage = 1;
              itemsPerPage = value;
            }
          }
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Pagination.ItemsPerPageSelect>
        <Pagination.ItemsCount
          showing={currentPage === numberOfPages
            ? totalItems % itemsPerPage || itemsPerPage
            : itemsPerPage}
          total={totalItems}
        />
      {/snippet}
      {#snippet rightGroup()}
        <Pagination.PageSelect
          bind:value={currentPage}
          totalPages={numberOfPages}
        >
          {#each { length: numberOfPages }, i (i)}
            <option value={i + 1}>{i + 1}</option>
          {/each}
        </Pagination.PageSelect>
      {/snippet}
      <Pagination.PageNavigation
        direction="first"
        disabled={currentPage === 1}
        onclick={() => (currentPage = 1)}
      />
      <Pagination.PageNavigation
        direction="previous"
        disabled={currentPage === 1}
        onclick={() => (currentPage = Math.max(1, currentPage - 1))}
      />
      <Pagination.PageNavigation
        direction="next"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = Math.min(numberOfPages, currentPage + 1))}
      />
      <Pagination.PageNavigation
        direction="last"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = numberOfPages)}
      />
    </Pagination>
  {/snippet}
</Story>

<Story name="Page navigation only">
  {#snippet template({ leftGroup: _, rightGroup: __, children: ___, ...args })}
    <Pagination {...args}>
      <Pagination.PageNavigation
        direction="first"
        disabled={currentPage === 1}
        onclick={() => (currentPage = 1)}
      />
      <Pagination.PageNavigation
        direction="previous"
        disabled={currentPage === 1}
        onclick={() => (currentPage = Math.max(1, currentPage - 1))}
      />
      <Pagination.PageNavigation
        direction="next"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = Math.min(numberOfPages, currentPage + 1))}
      />
      <Pagination.PageNavigation
        direction="last"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = numberOfPages)}
      />
    </Pagination>
  {/snippet}
</Story>

<Story name="With custom content">
  {#snippet template({ leftGroup: _, rightGroup: __, children: ___, ...args })}
    <Pagination {...args}>
      {#snippet rightGroup()}
        <div style="display: flex;">
          <input
            aria-label="Go to page"
            type="number"
            min={1}
            max={numberOfPages}
            bind:value={currentPage}
            style="border: 1px solid var(--lp-color-border-default); padding: 2px"
          />
        </div>
      {/snippet}
      <Pagination.PageNavigation
        direction="first"
        disabled={currentPage === 1}
        onclick={() => (currentPage = 1)}
      />
      <Pagination.PageNavigation
        direction="previous"
        disabled={currentPage === 1}
        onclick={() => (currentPage = Math.max(1, currentPage - 1))}
      />
      <Pagination.PageNavigation
        direction="next"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = Math.min(numberOfPages, currentPage + 1))}
      />
      <Pagination.PageNavigation
        direction="last"
        disabled={currentPage === numberOfPages}
        onclick={() => (currentPage = numberOfPages)}
      />
    </Pagination>
  {/snippet}
</Story>
