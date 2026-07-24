import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { packagesApi } from "$lib/api/packages/client.js";
import { query } from "$app/server";

export const getBinaryPackage = query(
  v.pipe(v.string(), v.trim(), v.minLength(1)),
  async (name) => {
    const {
      data,
      error: apiError,
      response,
    } = await packagesApi.GET("/binary-packages/{name}", {
      params: { path: { name } },
    });

    if (apiError) {
      error(response.status, apiError.detail);
    }

    return data;
  },
);
