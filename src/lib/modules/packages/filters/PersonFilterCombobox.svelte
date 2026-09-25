<script lang="ts">
  import { Popover, UserAvatar } from "@canonical/svelte-ds-app-launchpad";
  import { onMount } from "svelte";
  import { Combobox } from "$lib/components/index.js";
  import { PopoverTrigger } from "$lib/launchpad-components/index.js";
  import {
    MAX_PEOPLE_SEARCH_LENGTH,
    MIN_PEOPLE_SEARCH_LENGTH,
  } from "$lib/modules/people/constants.js";
  import {
    findPeople,
    getPersonByName,
  } from "$lib/modules/people/people.remote.js";
  import type { PersonEntry } from "$lib/server/launchpad/types.js";
  import { minTrimmedLength, subId } from "$lib/utils/index.js";
  import { browser } from "$app/env";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";

  const {
    form,
    inputName,
    selectedPersonName,
    groupName,
    "aria-labelledby": ariaLabelledBy,
  }: {
    form: string;
    inputName: string;
    selectedPersonName: string | null;
    groupName: string;
    "aria-labelledby": string;
  } = $props();

  const id = $props.id();

  // This is only used for the no-JS SSR path, where the intermediary combobox search parameter is submitted to populate the combobox on the server side.
  const comboboxSearchParam = $derived(`${inputName}-combobox-search`);
  let searchInputValue = $state(
    // svelte-check and eslint have different perceptions of whether this state is referenced locally or not
    // eslint-disable-next-line svelte/no-unused-svelte-ignore
    // svelte-ignore state_referenced_locally
    page.url.searchParams.get(comboboxSearchParam) ?? "",
  );
  // svelte-ignore state_referenced_locally
  let searchValue = $state(searchInputValue);

  onMount(() => {
    if (!page.url.searchParams.has(comboboxSearchParam)) return;
    const url = new URL(page.url);
    url.searchParams.delete(comboboxSearchParam);
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(url, { replaceState: true, keepFocus: true, noScroll: true });
  });

  let resetError: (() => void) | null = null;
  // Keeps the seeded query cache entry alive until the next selection.
  let selectedPersonQuery: ReturnType<typeof getPersonByName> | null = null;

  function submitPersonChange(
    event: Event & { currentTarget: HTMLInputElement },
    person: PersonEntry | null,
  ) {
    if (person) {
      selectedPersonQuery = getPersonByName({ text: person.name });
      selectedPersonQuery.set(person);
    }
    event.currentTarget.form?.requestSubmit();
  }

  const selectedPerson = $derived(
    selectedPersonName === null
      ? null
      : // TODO: Currently this path returns null instead of 404-ing, which should IMO should not be the case. A bogus hand-typed person in the URL should probably throw the page as it's gonna end up in the filters.
        await getPersonByName({ text: selectedPersonName }),
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
      <form
        method="GET"
        onsubmit={(e) => {
          e.preventDefault();
          searchValue = searchInputValue;
          resetError?.();
          resetError = null;
        }}
      >
        <!-- eslint-disable-next-line svelte/require-each-key -->
        {#each Array.from(page.url.searchParams).filter(([key]) => key !== comboboxSearchParam) as [key, value]}
          <input type="hidden" name={key} {value} />
        {/each}
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
          name={comboboxSearchParam}
          required
          maxlength={MAX_PEOPLE_SEARCH_LENGTH}
          {...minTrimmedLength(MIN_PEOPLE_SEARCH_LENGTH)}
        />
      </form>
    {/snippet}
    <Combobox.Group>
      <Combobox.RadioOption
        text="All"
        value=""
        checked={!selectedPersonName}
        onchange={(e) => submitPersonChange(e, null)}
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
            onchange={(e) => submitPersonChange(e, selectedPerson)}
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
                onchange={(e) => submitPersonChange(e, person)}
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
