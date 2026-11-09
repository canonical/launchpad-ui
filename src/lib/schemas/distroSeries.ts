import * as v from "valibot";
import { launchpadNameSchema } from "./launchpadName.js";

export const distroSeriesSchema = v.object({
  distro: launchpadNameSchema,
  series: launchpadNameSchema,
});
