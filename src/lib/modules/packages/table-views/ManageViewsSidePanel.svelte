<script lang="ts" module>
  import type { AddTableViewMode, TableView } from "./constants.js";
  import type { TableViewSettings } from "./schema.js";

  type ViewDraft = {
    /** The saved view's id, or a placeholder until a new view is saved. */
    key: string;
    /** `null` for a view created in the panel. */
    saved: TableView | null;
    settings: TableViewSettings;
    /** Whether `settings` should be sent on Save. */
    changed: boolean;
  };

  function toDraft(view: TableView): ViewDraft {
    return {
      key: view.id,
      saved: view,
      settings: { name: view.name, filters: view.filters },
      changed: false,
    };
  }

  function isEditable(draft: ViewDraft) {
    return draft.saved?.editable ?? true;
  }

  class DraftsSession {
    drafts = $state<ViewDraft[]>([]);
    saveError = $state<string | null>(null);
    bookmarkKey: string | null = null;

    constructor(items: TableView[]) {
      this.restart(items);
    }

    add(settings: TableViewSettings, mode: AddTableViewMode) {
      const key = `new-${crypto.randomUUID()}`;
      this.drafts.push({ key, saved: null, settings, changed: true });
      if (mode === "bookmark") this.bookmarkKey = key;
    }

    remove(key: string) {
      this.drafts = this.drafts.filter((draft) => draft.key !== key);
      if (this.bookmarkKey === key) this.bookmarkKey = null;
    }

    restart(items: TableView[]) {
      this.drafts = items.map(toDraft);
      this.saveError = null;
      this.bookmarkKey = null;
    }
  }
</script>

<script lang="ts">
  import { Button } from "@canonical/svelte-ds-app-launchpad";
  import { ButtonPrimitive } from "@canonical/svelte-ds-app-launchpad/internal";
  import { DeleteIcon, EditIcon, PlusIcon } from "@canonical/svelte-icons";
  import { isHttpError } from "@sveltejs/kit";
  import { settled, tick, untrack } from "svelte";
  import { ReorderableList } from "#lib/components/ReorderableList/index.js";
  import { SidePanel } from "#lib/launchpad-components/index.js";
  import {
    CLEARED_FILTER_PARAMS,
    MANAGE_VIEWS_PANEL,
    PANEL_QUERY_PARAM,
    QueryParams,
    toPackagesFilters,
  } from "#lib/modules/packages/superhref.js";
  import { preserveQueryParams } from "#lib/utils/index.js";
  import { getPackagesContext } from "../context.js";
  import { DEFAULT_PACKAGES_FILTERS } from "../filters/constants.js";
  import type { SeriesGroups } from "../filters/types.js";
  import { packagesFiltersDiffer } from "../filters/utils.js";
  import TableViewEditForm from "./TableViewEditForm.svelte";
  import {
    createTableView,
    deleteTableView,
    editTableView,
    getTableViews,
    updateTableViews,
  } from "./table-views.remote.js";
  import { getRecommendedViewName } from "./utils.js";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  let { open, seriesGroups }: { open: boolean; seriesGroups: SeriesGroups } =
    $props();

  const context = getPackagesContext();
  const distro = $derived(context.distro);
  const queryParams = $derived(context.queryParams);

  const items = $derived(await getTableViews(distro));

  // The session outlives the closing, so the content doesn't change while the panel slides out.
  // Each opening starts a new one, fresh for local modifications.
  let lastSession: DraftsSession | undefined;
  const session = $derived.by(() => {
    if (open || !lastSession)
      lastSession = new DraftsSession(untrack(() => items));
    return lastSession;
  });

  let suspendReorderAnimations = $state(false);
  // Suspend the reorder animation to not see it while panel opens.
  $effect.pre(() => {
    if (open) {
      suspendReorderAnimations = true;
      void tick().then(() => {
        suspendReorderAnimations = false;
      });
    }
  });

  const haveItemsChanged = $derived(
    items.length !== session.drafts.length ||
      items.some(({ id }, index) => id !== session.drafts[index].saved?.id) ||
      session.drafts.some(({ changed }) => changed),
  );

  const isItemEdited = $derived.by(() => {
    const editedKey = queryParams["manage-views"].edit;
    if (!editedKey) return false;
    return session.drafts.some(
      (draft) => draft.key === editedKey && isEditable(draft),
    );
  });

  const addMode = $derived(
    // Editing takes precedence
    isItemEdited ? null : queryParams["manage-views"].add,
  );

  const isAnyFormOpen = $derived(isItemEdited || addMode !== null);

  function stageViewSettings(key: string, settings: TableViewSettings) {
    const draft = session.drafts.find((draft) => draft.key === key);
    if (draft) {
      draft.settings = settings;
      draft.changed = true;
    }

    closeViewForm();
  }

  const stageNewView =
    (mode: AddTableViewMode) => (settings: TableViewSettings) => {
      session.add(settings, mode);

      closeViewForm();
    };

  function closeViewForm() {
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(queryParams["manage-views"].closeForm(), {
      reset: false,
      replace: true,
    });
  }

  /** Starts over from the latest views, which may have changed elsewhere (e.g. in another tab). */
  async function restartSession() {
    const tableViews = getTableViews(distro);
    await tableViews.refresh();
    session.restart(tableViews.current!);
  }

  let saving = $state(false);
  async function saveViews() {
    saving = true;
    session.saveError = null;
    await tick();

    try {
      const currentView = items.find(({ slug }) => slug === queryParams.view);
      const bookmarkIndex = session.drafts.findIndex(
        ({ key }) => key === session.bookmarkKey,
      );
      let savedViews: TableView[];
      try {
        savedViews = await updateTableViews({
          distro,
          views: session.drafts.map(({ saved, settings, changed }) =>
            saved
              ? { id: saved.id, settings: changed ? settings : undefined }
              : { settings },
          ),
        });
      } catch (error) {
        session.saveError = isHttpError(error)
          ? error.body.message
          : "Something went wrong";
        return;
      }
      const updatedView = savedViews.find(({ id }) => id === currentView?.id);
      const bookmarkedView = savedViews[bookmarkIndex];
      const shouldResetPage =
        bookmarkedView !== undefined ||
        (currentView &&
          (updatedView === undefined ||
            packagesFiltersDiffer(updatedView.filters, currentView.filters)));
      const shouldClearUrlFilters = bookmarkedView !== undefined;

      await goto(
        // eslint-disable-next-line svelte/no-navigation-without-resolve
        queryParams.patch({
          panel: null,
          "manage-views": null,
          view: (bookmarkedView ?? updatedView)?.slug ?? null,
          ...(shouldResetPage && { page: 1 }),
          ...(shouldClearUrlFilters && CLEARED_FILTER_PARAMS),
        }),
        {
          reset: false,
          // The views travel in the navigation state, so they're applied in the same update as the new URL.
          // Otherwise the URL can briefly point at a renamed view's old slug, or vice versa.
          state: { tableViews: savedViews },
        },
      );

      getTableViews(distro).set(savedViews);
      // After awaited queries pick up the new state it is safe to clear the page state
      await settled();
      if (page.state.tableViews === savedViews)
        goto(
          // eslint-disable-next-line svelte/no-navigation-without-resolve
          "",
          { shallow: true, replace: true },
        );
    } catch (error) {
      console.error(error);
    } finally {
      saving = false;
    }
  }
</script>

<SidePanel
  class="manage-views-side-panel"
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
        reset: false,
      },
    );
  }}
>
  <h3>Active views</h3>
  <ReorderableList
    bind:items={session.drafts}
    key={(draft) => draft.key}
    itemLabel={(draft) => draft.settings.name}
    disabled={isAnyFormOpen}
    animationDuration={suspendReorderAnimations ? 0 : undefined}
    dragMode="drop-indicator"
  >
    {#snippet item({ item: draft, index }, renderedInOverlay)}
      {#if isEditable(draft) && queryParams["manage-views"].edit === draft.key}
        <TableViewEditForm
          {distro}
          form={editTableView.for(draft.key)}
          settings={draft.settings}
          heading="Editing – {draft.settings.name}"
          cancelHref={queryParams["manage-views"].closeForm()}
          onstage={(settings) => stageViewSettings(draft.key, settings)}
          {seriesGroups}
        />
      {:else}
        <ReorderableList.Item item={draft} {index}>
          <span style="margin-inline-end: auto;">{draft.settings.name}</span>
          {#if isEditable(draft)}
            <Button
              density="dense"
              importance="tertiary"
              aria-label="Edit {draft.settings.name}"
              href={queryParams.editView(draft.key)}
              disabled={isAnyFormOpen}
            >
              {#snippet iconLeft()}
                <EditIcon />
              {/snippet}
            </Button>
            {const deleteForm = $derived(
              // Only attach the form function to the real, non-overlay items
              renderedInOverlay ? null : deleteTableView.for(draft.key),
            )}
            <form
              {...deleteForm &&
                preserveQueryParams(
                  deleteForm.enhance(() => {
                    // If JS, don't delete immediately, and instead stage for deletion in drafts
                    session.remove(draft.key);
                  }),
                  new URL(page.url.href),
                )}
            >
              {#if deleteForm}
                <input {...deleteForm.fields.distro.as("hidden", distro)} />
              {/if}
              <Button
                density="dense"
                importance="tertiary"
                aria-label="Delete {draft.settings.name}"
                disabled={isAnyFormOpen}
                {...deleteForm?.fields.id.as("submit", draft.key)}
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
  {#if addMode === "new"}
    <TableViewEditForm
      {distro}
      form={createTableView}
      settings={{ name: "", filters: DEFAULT_PACKAGES_FILTERS }}
      heading="Adding a new view"
      cancelHref={queryParams["manage-views"].closeForm()}
      onstage={stageNewView(addMode)}
      {seriesGroups}
    />
  {:else if addMode === "bookmark"}
    {const urlFilters = $derived(toPackagesFilters(queryParams))}
    <TableViewEditForm
      {distro}
      form={createTableView}
      settings={{
        name: getRecommendedViewName(urlFilters),
        filters: urlFilters,
      }}
      heading="Adding a new view"
      cancelHref={queryParams["manage-views"].closeForm()}
      onstage={stageNewView(addMode)}
      requireChange={false}
      {seriesGroups}
    />
  {:else}
    <ButtonPrimitive
      class="add-new-view"
      disabled={isAnyFormOpen}
      href={queryParams.addView("new")}
    >
      <PlusIcon />
      Add new view
    </ButtonPrimitive>
  {/if}
  {#snippet footer(closeButtonProps)}
    <div class="footer">
      <!-- TODO(@Enzo): Confirm the design of error reporting -->
      {#if session.saveError}
        <p class="save-error" role="alert">
          Couldn't save the views: {session.saveError}.
        </p>
      {/if}
      <Button {...closeButtonProps} importance="tertiary">Cancel</Button>
      {#if session.saveError}
        <Button
          importance="secondary"
          loading={getTableViews(distro).loading}
          onclick={() => restartSession()}
        >
          Reload views
        </Button>
      {:else}
        <Button
          disabled={!haveItemsChanged}
          loading={saving}
          importance="primary"
          anticipation="constructive"
          onclick={() => saveViews()}
        >
          Save
        </Button>
      {/if}
    </div>
  {/snippet}
</SidePanel>

<style>
  h3 {
    font: var(--ds-typography-text-primary-bold);
    margin-block-end: var(--dimension-200);
  }

  :global {
    .manage-views-side-panel {
      .add-new-view {
        color: var(--color-text-muted);
        display: flex;
        align-items: center;
        width: 100%;
        gap: var(--dimension-150);
        padding-inline-start: var(--dimension-050);
      }
    }
  }

  .save-error {
    flex-basis: 100%;
    color: var(--color-text-error);
  }

  .footer {
    display: contents;

    @media (scripting: none) {
      display: none;
    }
  }
</style>
