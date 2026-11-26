import { getCurrentUserTeams } from "#lib/modules/current-user/current-user.remote.js";
import { distroSeriesSchema } from "#lib/schemas/index.js";
import { MAIN_LAUNCHPAD_BASE_HOST } from "$app/env/private";
import { query } from "$app/server";

const LAUNCHPAD_ADMINS = "admins";
const REGISTRY_EXPERTS = "registry";

export const getSeriesAdminLinks = query(
  distroSeriesSchema,
  async ({ distro, series }) => {
    const teams = await getCurrentUserTeams();
    const isAdmin = teams.has(LAUNCHPAD_ADMINS);
    const seriesPage = new URL(`/${distro}/${series}`, MAIN_LAUNCHPAD_BASE_HOST)
      .href;

    return {
      changeDetails: isAdmin ? `${seriesPage}/+edit` : undefined,
      administer:
        isAdmin || teams.has(REGISTRY_EXPERTS)
          ? `${seriesPage}/+admin`
          : undefined,
    };
  },
);
