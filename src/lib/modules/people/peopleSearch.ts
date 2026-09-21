export type PersonOption = {
  name: string;
  displayName: string;
  isTeam: boolean;
};

export type CurrentUser = {
  name: string;
  displayName: string;
};

export type PeopleQuery = {
  text: string;
  start: number;
};

export type PeoplePage = {
  people: PersonOption[];
  hasMore: boolean;
};

export const PEOPLE_PAGE_SIZE = 20;

export function toPeoplePage(page: {
  found: PersonOption[];
  exactMatch: PersonOption | null;
  searchedName: string | null;
  hasMore: boolean;
}): PeoplePage {
  const others = page.found.filter(
    (person) => person.name !== page.searchedName,
  );
  return {
    people: page.exactMatch === null ? others : [page.exactMatch, ...others],
    hasMore: page.hasMore,
  };
}
