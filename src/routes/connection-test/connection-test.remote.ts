import { LaunchpadApiError } from "@canonical/launchpad-client";
import type { LaunchpadResponse } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { launchpadClient } from "$lib/server/launchpad/config.js";
import { form, getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";

const lpCookieName = env.MAIN_LAUNCHPAD_COOKIE_NAME || "lp";

export const getUbuntu = query(() =>
  inspectConnection(() =>
    launchpadClient.distribution.get({
      path: { distribution: "ubuntu" },
    }),
  ),
);

export const getMe = query(async () => {
  const { cookies } = getRequestEvent();
  const lpCookie = cookies.get(lpCookieName);
  return inspectConnection(() =>
    launchpadClient.person.me.get(
      {},
      {
        headers: lpCookie
          ? { cookie: `${lpCookieName}=${lpCookie}` }
          : undefined,
      },
    ),
  );
});

export const setLpCookie = form(
  v.object({
    _lp: v.pipe(v.string(), v.trim()),
    action: v.optional(v.picklist(["save", "clear"] as const)),
  }),
  async ({ _lp: lp, action }) => {
    const { cookies } = getRequestEvent();
    if (action === "clear") {
      cookies.delete(lpCookieName, { path: "/" });
    } else {
      cookies.set(lpCookieName, lp, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });
    }
    void getMe().refresh();
  },
);

async function inspectConnection(
  send: () => Promise<LaunchpadResponse<unknown>>,
): Promise<ConnectionResponse> {
  try {
    let result: LaunchpadResponse<unknown>;
    try {
      result = await send();
    } catch (requestError) {
      if (!(requestError instanceof LaunchpadApiError)) throw requestError;
      // The diagnostic screen displays upstream failures instead of hiding their status.
      result = { response: requestError.response, data: requestError.body };
    }
    const { response, data } = result;
    return /\bjson\b/i.test(response.headers.get("content-type") ?? "")
      ? { status: response.status, json: data }
      : { status: response.status, text: typeof data === "string" ? data : "" };
  } catch (requestError) {
    console.error(
      "Launchpad connection failed",
      requestError instanceof Error
        ? requestError.message
        : String(requestError),
    );
    error(502, "Request to Launchpad failed");
  }
}

export type ConnectionResponse =
  | { status: number; json: unknown }
  | { status: number; text: string };
