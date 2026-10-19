import { LaunchpadApiError } from "@canonical/launchpad-client";
import type { PersonFull } from "@canonical/launchpad-client/schemas/models/person";
import * as v from "valibot";
import { launchpadClient } from "$lib/server/launchpad/config.js";
import { toLaunchpadName } from "$lib/utils/launchpad/launchpadName.js";
import { MAX_PEOPLE_SEARCH_LENGTH } from "./constants.js";
import { PersonSearchSchema } from "./schema.js";
import { query } from "$app/server";

export const findPeople = query(
  v.object({ text: PersonSearchSchema }),
  async ({ text }): Promise<PersonFull[]> => {
    const searchedName = toLaunchpadName(text);
    const [exactMatch, { data }] = await Promise.all([
      searchedName !== null
        ? fetchPerson(searchedName).catch((requestError: unknown) => {
            console.error(
              `Failed to look up the Launchpad person ${searchedName}`,
              requestError,
            );
            return null;
          })
        : null,
      launchpadClient.people.find({ query: { text: searchedName ?? text } }),
    ]);
    return exactMatch === null
      ? data.entries
      : [
          exactMatch,
          ...data.entries.filter((person) => person.name !== exactMatch.name),
        ];
  },
);

export const getPersonByName = query(
  v.pipe(v.string(), v.trim(), v.maxLength(MAX_PEOPLE_SEARCH_LENGTH)),
  async (reference) => {
    const name = toLaunchpadName(reference);
    return name ? fetchPerson(name) : null;
  },
);

async function fetchPerson(name: string): Promise<PersonFull | null> {
  try {
    const { data } = await launchpadClient.person.get({
      path: { person: `~${name}` },
    });
    return data;
  } catch (requestError) {
    if (
      requestError instanceof LaunchpadApiError &&
      [404, 410].includes(requestError.status)
    )
      return null;
    throw requestError;
  }
}
