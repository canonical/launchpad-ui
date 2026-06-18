import { HttpResponse, http } from "msw";
import { ERROR_INJECT_PARAM } from "../../constants.js";
import { delay } from "./helpers/latency.js";
import { PACKAGES_API_WILDCARD } from "./helpers/paths.js";

export const injectErrorHandler = http.all(
  PACKAGES_API_WILDCARD,
  async ({ request }) => {
    const inject = Number(
      new URL(request.url).searchParams.get(ERROR_INJECT_PARAM),
    );
    if (Number.isFinite(inject) && inject >= 400) {
      // delay() only on the injection branch — falling through must not wait,
      // or the downstream safeWrap pays the latency a second time.
      await delay();
      return HttpResponse.json(
        { detail: `Injected error: ${inject}`, code: "injected" },
        { status: inject },
      );
    }
    return undefined;
  },
);
