import { error } from "@sveltejs/kit";
import { packagesApi } from "$lib/api/packages/client.js";
import { QueryParams } from "$lib/modules/packages/superhref.js";
import type { PageLoad } from "./$types.js";

export const load = (async ({ fetch, params, url }) => {
  const { sort } = QueryParams.parse(url);
  const {
    data,
    error: packagesError,
    response,
  } = await packagesApi.GET("/source-packages", {
    fetch,
    params: {
      query: {
        distro: params.pillar,
        ...(sort.key !== null && {
          sort: sort.key,
          order: sort.direction === "ascending" ? "asc" : "desc",
        }),
      },
    },
  });
  if (packagesError)
    error(response?.status ?? 500, response?.statusText ?? "Unknown error");
  return data;
}) satisfies PageLoad;
