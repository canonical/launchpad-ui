<script lang="ts">
  import {
    Popover,
    SearchBox,
    UserAvatar,
  } from "@canonical/svelte-ds-app-launchpad";
  import { Combobox } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import {
    MAX_PEOPLE_SEARCH_LENGTH,
    MIN_PEOPLE_SEARCH_LENGTH,
  } from "$lib/modules/packages/constants.js";
  import {
    findPeople,
    getPersonByName,
  } from "$lib/modules/packages/people.remote.js";
  import type { PersonEntry } from "$lib/server/launchpad/types.js";
  import { minTrimmedLength, subId } from "$lib/utils/index.js";
  import type { FilterChangeHandler } from "./types.js";
  import { browser } from "$app/env";

  const {
    form,
    inputName,
    searchInputName,
    initialSearch,
    selectedPersonName,
    groupName,
    onchange,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    searchInputName: string;
    initialSearch: string | null;
    selectedPersonName: string | null;
    groupName: string;
    /** Called with the chosen person's Launchpad name, or `null` for All. */
    onchange: FilterChangeHandler<string | null>;
    "aria-labelledby": string;
  } = $props();

  const id = $props.id();

  // With JS the search runs here, so pointing `form` at no form keeps it from being submitted or validated with any
  const searchForm = $derived(browser ? subId(id, "no-form") : form);

  // svelte-ignore state_referenced_locally
  let searchInputValue = $state(initialSearch ?? "");
  // svelte-ignore state_referenced_locally
  let searchValue = $state(initialSearch ?? "");
  let searchInput = $state<HTMLInputElement>();

  let resetError: (() => void) | null = null;

  function runSearch() {
    if (!searchInput?.reportValidity()) return;
    searchValue = searchInputValue;
    resetError?.();
    resetError = null;
  }
  // Keeps the seeded query cache entry alive until the next selection.
  let selectedPersonQuery: ReturnType<typeof getPersonByName> | null = null;

  function changePerson(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
    person: PersonEntry | null,
  ) {
    if (person) {
      selectedPersonQuery = getPersonByName(person.name);
      selectedPersonQuery.set(person);
    }
    onchange(event, person?.name ?? null);
  }

  const selectedPerson = $derived(
    selectedPersonName === null
      ? null
      : // TODO: Currently this path returns null instead of 404-ing, which should IMO should not be the case. A bogus hand-typed person in the URL should probably throw the page as it's gonna end up in the filters.
        await getPersonByName(selectedPersonName),
  );
</script>

<Popover>
  {#snippet trigger(triggerProps)}
    <PopoverTrigger aria-labelledby={ariaLabelledBy} {...triggerProps}>
      {selectedPerson ? selectedPerson.display_name : "All"}
    </PopoverTrigger>
  {/snippet}
  <Combobox inputsName={inputName} type="single-select">
    {#snippet search()}
      <Combobox.Search
        aria-label="Search {groupName}"
        placeholder="Search {groupName}..."
        shouldRenderInvalidStyles
        bind:value={
          () => searchInputValue,
          (value) => {
            searchInputValue = value;
            if (value === "") {
              searchValue = "";
            }
          }
        }
        form={searchForm}
        name={browser ? undefined : searchInputName}
        maxlength={MAX_PEOPLE_SEARCH_LENGTH}
        {...minTrimmedLength(MIN_PEOPLE_SEARCH_LENGTH)}
        onkeydown={(event) => {
          if (event.key !== "Enter") return;
          event.preventDefault();
          runSearch();
        }}
        {@attach (input: HTMLInputElement) => {
          searchInput = input;
          return () => (searchInput = undefined);
        }}
      >
        <SearchBox.SearchButton form={searchForm} onclick={runSearch} />
      </Combobox.Search>
    {/snippet}
    <Combobox.Group>
      <Combobox.RadioOption
        text="All"
        value=""
        checked={!selectedPersonName}
        onchange={(e) => changePerson(e, null)}
        {form}
      />
      {#if selectedPerson}
        <!-- Without this remount, svelte reuses the component, and updates the props. The `checked` value however doesn't change (true -> true), so Svelte doesn't update the internal radio state. -->
        {#key selectedPerson.name}
          <Combobox.RadioOption
            text={selectedPerson.display_name}
            secondaryText={selectedPerson.name}
            value={selectedPerson.name}
            checked={true}
            onchange={(e) => changePerson(e, selectedPerson)}
            {form}
            id={subId(id, selectedPerson.name)}
          >
            {#snippet icon()}
              <UserAvatar
                userAvatarUrl={selectedPerson.mugshot_link}
                userName={selectedPerson.display_name}
                size="small"
              />
            {/snippet}
          </Combobox.RadioOption>
        {/key}
      {/if}
    </Combobox.Group>
    {#if searchValue}
      <Combobox.Group groupTitle="Search results">
        <svelte:boundary
          onerror={(e, reset) => {
            console.error(e);
            resetError = reset;
          }}
        >
          {const peopleQuery = $derived(findPeople({ text: searchValue }))}
          {#if peopleQuery.loading && browser}
            <Combobox.Loading />
          {:else}
            {#each (await peopleQuery).filter(({ name }) => name !== selectedPerson?.name) as person (person.name)}
              <Combobox.RadioOption
                text={person.display_name}
                secondaryText={person.name}
                value={person.name}
                onchange={(e) => changePerson(e, person)}
                {form}
                id={subId(id, person.name)}
              >
                {#snippet icon()}
                  <UserAvatar
                    userAvatarUrl={person.mugshot_link}
                    userName={person.display_name}
                    size="small"
                  />
                {/snippet}</Combobox.RadioOption
              >
            {:else}
              <Combobox.NoResults />
            {/each}
          {/if}
          {#snippet failed()}
            <Combobox.NoResults
              >Failed to load search results.</Combobox.NoResults
            >
          {/snippet}
        </svelte:boundary>
      </Combobox.Group>
    {/if}
  </Combobox>
</Popover>
