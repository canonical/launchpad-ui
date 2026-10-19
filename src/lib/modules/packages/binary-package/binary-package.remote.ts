import { LaunchpadApiError } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { launchpadClient } from "$lib/server/launchpad/config.js";
import { binaryPackageDetailsSchema } from "../api.schema.js";
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
      const { data } =
        await launchpadClient.archive.distribution.getBinaryPackageDetails(
          {
            path: { distribution: distro, archive: "primary" },
            query: { binary_id: String(binaryId) },
          },
          // This qastaging-only operation has no documented response contract yet.
          { decode: (value) => v.parse(binaryPackageDetailsSchema, value) },
        );
      return data;
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
