import { http, HttpResponse } from "msw";
import { findBinaryPackage } from "../data/binary-packages.js";
import { PACKAGES_API } from "./helpers/paths.js";
import { notFoundResponse } from "./helpers/responses.js";
import { safeWrap } from "./helpers/wrap.js";

export const binaryPackagesHandlers = [
  http.get(
    `${PACKAGES_API}/binary-packages/:name`,
    safeWrap(({ params }) => {
      const name = String(params.name ?? "");
      if (!name) {
        return notFoundResponse("Binary package name is required");
      }
      const found = findBinaryPackage(name);
      if (!found) {
        return notFoundResponse(`Binary package ${name} not found`);
      }
      return HttpResponse.json(found.details);
    }),
  ),
];
