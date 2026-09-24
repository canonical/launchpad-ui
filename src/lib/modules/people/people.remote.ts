import * as v from "valibot";
import { toLaunchpadName } from "$lib/launchpadName.js";
import {
  findPeople as findLaunchpadPeople,
  getPerson,
} from "$lib/server/launchpad/client.js";
import { query } from "$app/server";

export type PersonOption = {
  name: string;
  displayName: string;
  isTeam: boolean;
};

const peopleQuerySchema = v.object({
  text: v.pipe(v.string(), v.trim(), v.minLength(2), v.maxLength(200)),
});

export const findPeople = query(
  peopleQuerySchema,
  async ({ text }): Promise<PersonOption[]> => {
    const searchedName = toLaunchpadName(text);
    try {
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
      return people.map(({ name, display_name, is_team }) => ({
        name,
        displayName: display_name,
        isTeam: is_team,
      }));
    } catch (requestError) {
      console.error("Failed to search Launchpad people", requestError);
      return [];
    }
  },
);
