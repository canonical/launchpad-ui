import { error } from "@sveltejs/kit";
import { packagesApi } from "$lib/api/packages/client.js";
import type { PageLoad } from "./$types.js";

export const load = (async ({ fetch, params }) => {
  const {
    data,
    error: packagesError,
    response,
  } = await packagesApi.GET("/source-packages", {
    fetch,
    params: { query: { distro: params.pillar } },
  });
  if (packagesError)
    error(response?.status ?? 500, response?.statusText ?? "Unknown error");
  return data;
}) satisfies PageLoad;
