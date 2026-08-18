import { packagesApi } from "$lib/api/packages/client.js";
import type {
  Paginated,
  SourcePackageListItem,
} from "$lib/api/packages/types.js";
import { QueryParams } from "$lib/modules/packages/superhref.js";
import type { PageLoad } from "./$types.js";

export const load = (async ({
  fetch,
  params,
  url,
}): Promise<
  | (Paginated<SourcePackageListItem> & { unavailable?: undefined })
  | { unavailable: true }
> => {
  const { sort } = QueryParams.parse(url);
  try {
    const {
      data,
      error: apiError,
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
    if (data) return data;
    console.error(
      `Failed to load source packages (${response.status})`,
      apiError,
    );
  } catch (requestError) {
    console.error("Failed to load source packages", requestError);
  }
  return { unavailable: true };
}) satisfies PageLoad;
