import type { Codec } from "@canonical/superhref";
import { toLaunchpadName } from "$lib/utils/launchpad/launchpadName.js";

export function launchpadNameCodec(): Codec<string | null> {
  return {
    parse: toLaunchpadName,
    serialize: (value) => value,
  };
}
