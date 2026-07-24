// This could/should be moved somewhere when we notice that config or its parts need to be shared between different routes.

import { strCodec, superhref } from "@canonical/superhref";

export const BINARY_PACKAGE_QUERY_PARAM = "binary-package" as const;

export const QueryParams = superhref({
  [BINARY_PACKAGE_QUERY_PARAM]: strCodec(),
});

export type BoundPackagesQueryParams = ReturnType<typeof QueryParams.bind>;
