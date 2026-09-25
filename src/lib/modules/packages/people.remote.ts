import * as v from "valibot";
import {
  findPeople as findLaunchpadPeople,
  getPerson,
} from "$lib/server/launchpad/client.js";
import type { PersonEntry } from "$lib/server/launchpad/types.js";
import { toLaunchpadName } from "$lib/utils/launchpad/launchpadName.js";
import {
  MAX_PEOPLE_SEARCH_LENGTH,
  MIN_PEOPLE_SEARCH_LENGTH,
} from "./constants.js";
import { query } from "$app/server";

export const findPeople = query(
  v.object({
    text: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(MIN_PEOPLE_SEARCH_LENGTH),
      v.maxLength(MAX_PEOPLE_SEARCH_LENGTH),
    ),
  }),
  async ({ text }): Promise<PersonEntry[]> => {
    const searchedName = toLaunchpadName(text);

    const [exactMatch, found] = await Promise.all([
      searchedName !== null
        ? getPerson(searchedName).catch((requestError: unknown) => {
            console.error(
              `Failed to look up the Launchpad person ${searchedName}`,
              requestError,
            );
            return null;
          })
        : null,
      findLaunchpadPeople(searchedName ?? text),
    ]);

    const people =
      exactMatch === null
        ? found.entries
        : [
            exactMatch,
            ...found.entries.filter(
              (person) => person.name !== exactMatch.name,
            ),
          ];

    return people;
  },
);

export const getPersonByName = query(
  v.object({
    text: v.pipe(v.string(), v.trim(), v.maxLength(MAX_PEOPLE_SEARCH_LENGTH)),
  }),
  async ({ text }): Promise<PersonEntry | null> => {
    const name = toLaunchpadName(text);
    if (!name) return null;

    return await getPerson(name);
  },
);
