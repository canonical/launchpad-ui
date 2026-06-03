import { http, HttpResponse } from "msw";
import { PACKAGES_API } from "./helpers/paths.js";
import { safeWrap } from "./helpers/wrap.js";

export const healthHandlers = [
  http.get(
    `${PACKAGES_API}/health`,
    safeWrap(() =>
      HttpResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
      }),
    ),
  ),
];
