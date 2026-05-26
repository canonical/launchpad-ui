import { binaryPackagesHandlers } from "./binary-packages.js";
import { healthHandlers } from "./health.js";
import { injectErrorHandler } from "./inject-error.js";
import { meHandlers } from "./me.js";
import { sourcePackageDetailHandlers } from "./source-packages-detail.js";
import { sourcePackagesHandlers } from "./source-packages.js";
import { versionsHandlers } from "./versions.js";

// inject-error must be first (short-circuits before typed handlers).
// fallback is appended in `mocks/server.ts` and must be last.
export const handlers = [
  injectErrorHandler,
  ...healthHandlers,
  ...sourcePackagesHandlers,
  ...sourcePackageDetailHandlers,
  ...versionsHandlers,
  ...binaryPackagesHandlers,
  ...meHandlers,
];
