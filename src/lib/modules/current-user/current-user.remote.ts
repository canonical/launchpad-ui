import { LaunchpadApiError } from "@canonical/launchpad-client";
import { zTeamFull } from "@canonical/launchpad-client/schemas/models/team";
import { launchpadClient } from "#lib/server/launchpad/client.js";
import { getCurrentUserHeaders } from "#lib/server/launchpad/session.js";
import { query } from "$app/server";

const LARGEST_LAUNCHPAD_PAGE_SIZE = 300;
const teamNameSchema = zTeamFull.pick({ name: true });

export const getCurrentUser = query(async () => {
  const headers = getCurrentUserHeaders();
  if (!headers) return undefined;

  try {
    const { data: me } = await launchpadClient.person.me.get({}, { headers });
    return {
      name: me.name,
      display_name: me.display_name,
      web_link: me.web_link,
    };
  } catch (requestError) {
    if (!isUnauthorized(requestError)) {
      console.error(
        "Failed to resolve the current Launchpad user",
        requestError,
      );
    }
    return undefined;
  }
});

export const getCurrentUserTeams = query(async () => {
  const headers = getCurrentUserHeaders();
  if (!headers) return new Set<string>();

  try {
    return await fetchAllLaunchpadTeams(headers);
  } catch (requestError) {
    if (!isUnauthorized(requestError)) {
      console.error(
        "Failed to resolve the current Launchpad user's teams",
        requestError,
      );
    }
    return new Set<string>();
  }
});

/**
 * Fetch all Launchpad teams the current user belongs to, directly or through
 * other teams.
 *
 * Handles pagination automatically for the rare user who belongs to more teams
 * than fit on one page.
 *
 * @param headers - Request headers carrying the user's Launchpad session cookie.
 * @returns The names of the teams.
 */
async function fetchAllLaunchpadTeams(headers: { cookie?: string }) {
  const { data: firstPage } = await launchpadClient.person.me.superTeams.get(
    { query: { "ws.size": LARGEST_LAUNCHPAD_PAGE_SIZE } },
    { headers },
  );
  const teamNames = await Array.fromAsync(
    launchpadClient.items(firstPage, {
      headers,
      decodeEntry: (entry) => teamNameSchema.parse(entry).name,
    }),
  );
  return new Set(teamNames);
}

function isUnauthorized(requestError: unknown) {
  return (
    requestError instanceof LaunchpadApiError && requestError.status === 401
  );
}
