import * as v from "valibot";
import { toLaunchpadName } from "$lib/launchpadName.js";
import {
  findPeople as findLaunchpadPeople,
  getCurrentPerson,
  getPerson,
} from "$lib/server/launchpad/client.js";
import { getSessionCookie } from "$lib/server/launchpad/session.js";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import { PEOPLE_PAGE_SIZE, toPeoplePage } from "./peopleSearch.js";
import type { CurrentUser, PeoplePage, PersonOption } from "./peopleSearch.js";
import { query } from "$app/server";

const peopleQuerySchema = v.object({
  text: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(200)),
  start: v.pipe(v.number(), v.integer(), v.minValue(0)),
});

export const findPeople = query(
  peopleQuerySchema,
  async ({ text, start }): Promise<PeoplePage> => {
    const searchedName = toLaunchpadName(text);
    try {
      const [exactMatch, found] = await Promise.all([
        start === 0 && searchedName !== null
          ? findPersonNamed(searchedName)
          : null,
        findLaunchpadPeople(searchedName ?? text, {
          size: PEOPLE_PAGE_SIZE,
          start,
        }),
      ]);

      return toPeoplePage({
        found: found.entries.map(toPersonOption),
        exactMatch,
        searchedName,
        hasMore: found.next_collection_link !== undefined,
      });
    } catch (requestError) {
      console.error("Failed to search Launchpad people", requestError);
      return { people: [], hasMore: false };
    }
  },
);

export const getCurrentUser = query(async (): Promise<CurrentUser | null> => {
  const sessionCookie = getSessionCookie();
  if (!sessionCookie) {
    return null;
  }
  try {
    const person = await getCurrentPerson(sessionCookie);
    return person && { name: person.name, displayName: person.display_name };
  } catch (requestError) {
    console.error("Failed to resolve the current Launchpad user", requestError);
    return null;
  }
});

async function findPersonNamed(name: string): Promise<PersonOption | null> {
  try {
    const person = await getPerson(name);
    return person && toPersonOption(person);
  } catch (requestError) {
    console.error(
      `Failed to look up the Launchpad person ${name}`,
      requestError,
    );
    return null;
  }
}

function toPersonOption({
  name,
  display_name,
  is_team,
}: PersonEntry): PersonOption {
  return { name, displayName: display_name, isTeam: is_team };
}
