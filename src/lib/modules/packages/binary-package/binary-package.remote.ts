import { error } from "@sveltejs/kit";
import * as v from "valibot";
import {
  LaunchpadApiError,
  getBinaryPackageDetails,
} from "$lib/server/launchpad/client.js";
import { query } from "$app/server";

const binaryIdSchema = v.pipe(
  v.string(),
  v.regex(/^[1-9]\d*$/),
  v.transform(Number),
  v.safeInteger(),
);
const ERROR_MESSAGES: Partial<Record<number, string>> = {
  400: "Launchpad couldn't process this binary package request.",
  404: "This binary package could not be found.",
};

export const getBinaryPackage = query(
  v.object({
    distro: v.pipe(v.string(), v.trim(), v.minLength(1)),
    binaryId: binaryIdSchema,
  }),
  async ({ distro, binaryId }) => {
    try {
      return await getBinaryPackageDetails(distro, binaryId);
    } catch (requestError) {
      console.error("Failed to load binary package details", requestError);
      const status =
        requestError instanceof LaunchpadApiError &&
        Number.isInteger(requestError.status) &&
        requestError.status >= 400 &&
        requestError.status <= 599
          ? requestError.status
          : 503;
      error(
        status,
        ERROR_MESSAGES[status] ??
          "Couldn't load binary package details. Try again shortly.",
      );
    }
  },
);
