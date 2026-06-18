import { HttpResponse, http } from "msw";
import type { PackagesViewsPreference } from "../../types.js";
import { getPackagesViews, setPackagesViews } from "../state.js";
import { PACKAGES_API } from "./helpers/paths.js";
import { badRequestResponse } from "./helpers/responses.js";
import { safeWrap } from "./helpers/wrap.js";

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const parsePackagesViews = (
  body: unknown,
):
  | { ok: true; value: PackagesViewsPreference }
  | { ok: false; detail: string } => {
  if (typeof body !== "object" || body === null) {
    return { ok: false, detail: "Request body must be a JSON object" };
  }
  const candidate = body as Record<string, unknown>;
  if (!isStringArray(candidate.defaultTabs)) {
    return { ok: false, detail: "Field `defaultTabs` must be a string[]" };
  }
  if (!isStringArray(candidate.myTeams)) {
    return { ok: false, detail: "Field `myTeams` must be a string[]" };
  }
  return {
    ok: true,
    value: {
      defaultTabs: candidate.defaultTabs,
      myTeams: candidate.myTeams,
    },
  };
};

export const meHandlers = [
  http.get(
    `${PACKAGES_API}/me/packages-views`,
    safeWrap(() => HttpResponse.json(getPackagesViews())),
  ),

  http.put(
    `${PACKAGES_API}/me/packages-views`,
    safeWrap(async ({ request }) => {
      let body: unknown;
      try {
        body = await request.json();
      } catch {
        return badRequestResponse("Request body must be valid JSON");
      }
      const parsed = parsePackagesViews(body);
      if (!parsed.ok) return badRequestResponse(parsed.detail);
      return HttpResponse.json(setPackagesViews(parsed.value));
    }),
  ),
];
