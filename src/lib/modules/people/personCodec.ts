import type { Codec } from "@canonical/superhref";
import { toLaunchpadName } from "$lib/launchpadName.js";

export const CURRENT_PERSON = "me";

export function personCodec(): Codec<string | null> {
  return {
    parse: toLaunchpadName,
    serialize: (value) => value,
  };
}
