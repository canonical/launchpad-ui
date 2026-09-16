import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { launchpadFetch } from "$lib/server/launchpad/launchpadFetch.js";
import { form, getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";

const lpCookieName = env.MAIN_LAUNCHPAD_COOKIE_NAME || "lp";

export const getUbuntu = query(() => client("/api/devel/ubuntu"));

export const getMe = query(async () => {
  const { cookies } = getRequestEvent();
  const lpCookie = cookies.get(lpCookieName);

  return await client("/api/devel/people/+me", lpCookie);
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

async function client(
  path: string,
  lpCookie?: string,
): Promise<ConnectionResponse> {
  const baseHost = env.MAIN_LAUNCHPAD_BASE_HOST;
  if (!baseHost) {
    error(500, "MAIN_LAUNCHPAD_BASE_HOST is not set");
  }

  const url = new URL(path, baseHost);

  const headers: Record<string, string> = {};
  if (lpCookie) {
    headers["cookie"] = `${lpCookieName}=${lpCookie}`;
  }

  const loggableHeaders = { ...headers };
  if (loggableHeaders.cookie) {
    loggableHeaders.cookie = `<${lpCookieName}>`;
  }

  const logContext = { url: url.toString(), headers: loggableHeaders };

  let status: number;
  let text: string;
  try {
    console.log("Launchpad request started", logContext);

    const MAX_REDIRECTS = 5;
    let currentUrl: URL = url;

    for (let redirects = 0; ; redirects++) {
      const response = await launchpadFetch(currentUrl, { headers });

      const isRedirect = response.status >= 300 && response.status < 400;
      const location = response.headers.get("location");
      if (isRedirect && location && redirects < MAX_REDIRECTS) {
        currentUrl = new URL(location, currentUrl);
        continue;
      }

      status = response.status;
      text = await response.text();
      break;
    }

    console.log("Launchpad request finished successfully", {
      ...logContext,
      status,
    });
  } catch (e) {
    console.error("Launchpad request failed", {
      ...logContext,
      error: e instanceof Error ? e.message : String(e),
    });
    error(
      502,
      `Request to ${url.host} failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  try {
    return { status, json: JSON.parse(text) };
  } catch {
    return { status, text };
  }
}

export type ConnectionResponse =
  | {
      status: number;
      json: unknown;
    }
  | {
      status: number;
      text: string;
    };
