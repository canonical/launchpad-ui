<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { DeleteIcon, EditIcon } from "@canonical/svelte-icons";
  import { tick, untrack } from "svelte";
  import { ReorderableList } from "$lib/components/ReorderableList/index.js";
  import { SidePanel } from "$lib/launchpad-components/index.js";
  import {
    MANAGE_VIEWS_PANEL,
    PANEL_QUERY_PARAM,
    QueryParams,
  } from "$lib/modules/packages/superhref.js";
  import { getPackagesContext } from "../context.js";
  import type { TableView } from "./constants.js";
  import { deleteTableView, updateTableViews } from "./table-views.remote.js";
  import { goto } from "$app/navigation";

  let {
    open,
    items,
  }: {
    open: boolean;
    items: TableView[];
  } = $props();

  const context = getPackagesContext();
  const queryParams = $derived(context.queryParams);

  // Snapshot of the items for local modifications
  // svelte-ignore state_referenced_locally
  let modifiedItems = $state(items);
  let suspendReorderAnimations = $state(false);
  // Refresh the snapshot each time the panel is opened. Suspend the reorder animation to not see it while panel opens.
  $effect.pre(() => {
    if (open) {
      modifiedItems = untrack(() => items);

      suspendReorderAnimations = true;
      void tick().then(() => {
        suspendReorderAnimations = false;
      });
    }
  });

  const haveItemsChanged = $derived(
    items.length !== modifiedItems.length ||
      items.some(({ slug }, index) => slug !== modifiedItems[index].slug),
  );

  const willCurrentViewBeDeleted = $derived(
    !modifiedItems.some(({ slug }) => slug === queryParams.view),
  );

  const isItemEdited = $derived.by(() => {
    const editedItemSlug = queryParams["manage-views"].edit;
    if (!editedItemSlug) return false;
    return modifiedItems.some(
      ({ slug, editable }) => slug === editedItemSlug && editable,
    );
  });

  let saving = $state(false);
</script>

<SidePanel
  title="Packages table views"
  {open}
  closeForm={{
    schema: QueryParams,
    replaceParams: [PANEL_QUERY_PARAM, MANAGE_VIEWS_PANEL],
  }}
  onclose={() => {
    goto(
      // eslint-disable-next-line svelte/no-navigation-without-resolve
      queryParams.patch({
        panel: null,
        "manage-views": null,
      }),
      {
        keepFocus: true,
        noScroll: true,
      },
    );
  }}
>
  <h3>Active views</h3>
  <ReorderableList
    bind:items={modifiedItems}
    key={(item) => item.slug}
    itemLabel={(item) => item.name}
    disabled={isItemEdited}
    animationDuration={suspendReorderAnimations ? 0 : undefined}
    dragMode="drop-indicator"
  >
    {#snippet item({ item, index }, renderedInOverlay)}
      {#if item.editable && queryParams["manage-views"].edit === item.slug}
        <!-- TODO: View edit form (https://warthogs.atlassian.net/browse/LP-4570) -->
        <div
          style="display: grid; place-content: center; min-block-size: 10rem; border: 1px solid #ccc;"
        >
          Edit form will be here
        </div>
      {:else}
        <ReorderableList.Item {item} {index}>
          <span style="margin-inline-end: auto;">{item.name}</span>
          {#if item.editable}
            <Button
              density="dense"
              importance="tertiary"
              aria-label="Edit {item.name}"
              href={queryParams["manage-views"].set("edit", item.slug)}
              // TODO: View edit form (https://warthogs.atlassian.net/browse/LP-4570)
              disabled={// eslint-disable-next-line no-constant-binary-expression
              true || isItemEdited}
            >
              {#snippet iconLeft()}
                <EditIcon />
              {/snippet}
            </Button>
            {const deleteForm = $derived(
              // Only attach the form function to the real, non-overlay items
              renderedInOverlay ? null : deleteTableView.for(item.slug),
            )}
            <form
              {...deleteForm?.enhance(() => {
                // If JS, don't delete immediately, and instead stage for deletion in modifiedItems
                modifiedItems = modifiedItems.filter(
                  ({ slug }) => slug !== item.slug,
                );
              })}
            >
              <Button
                density="dense"
                importance="tertiary"
                aria-label="Delete {item.name}"
                disabled={isItemEdited}
                {...deleteForm?.fields.slug.as("submit", item.slug)}
              >
                {#snippet iconLeft()}
                  <DeleteIcon />
                {/snippet}
              </Button>
            </form>
          {/if}
        </ReorderableList.Item>
      {/if}
    {/snippet}
  </ReorderableList>
  {#snippet footer(closeButtonProps)}
    <Button {...closeButtonProps} importance="tertiary">Cancel</Button>
    <Button
      disabled={!haveItemsChanged}
      loading={saving}
      importance="primary"
      anticipation="constructive"
      onclick={async () => {
        saving = true;
        try {
          await updateTableViews(modifiedItems.map((item) => item.slug));
          goto(
            // eslint-disable-next-line svelte/no-navigation-without-resolve
            queryParams.patch({
              panel: null,
              "manage-views": null,
              ...(willCurrentViewBeDeleted ? { view: null } : {}),
            }),
            {
              keepFocus: true,
              noScroll: true,
            },
          );
        } catch (error) {
          console.error(error);
        }

        saving = false;
      }}
    >
      Save
    </Button>
  {/snippet}
</SidePanel>

<style>
  h3 {
    font: var(--ds-typography-text-primary-bold);
    margin-block-end: var(--dimension-200);
  }
</style>
