import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { form, getRequestEvent, query } from "$app/server";
import { env } from "$env/dynamic/private";

const lpCookieName = "lp";

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

  const ipAddress = env.MAIN_LAUNCHPAD_IP_ADDRESS;
  const url = new URL(path, ipAddress || baseHost);

  const headers = new Headers();
  if (ipAddress) {
    headers.set("Host", new URL(baseHost).host);
  }
  if (lpCookie) {
    headers.set("Cookie", `${lpCookieName}=${lpCookie}`);
  }

  const { fetch } = getRequestEvent();
  let response: Response;
  try {
    const loggableHeaders = Object.fromEntries(headers);
    if (loggableHeaders.cookie) {
      loggableHeaders.cookie = "<supplied>";
    }
    console.log("Making request to Launchpad", {
      url: url.toString(),
      headers: loggableHeaders,
    });
    response = await fetch(url, { headers });
  } catch (e) {
    error(
      502,
      `Request to ${url.host} failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  const text = await response.text();

  try {
    const json = JSON.parse(text);
    return { status: response.status, json };
  } catch {
    return { status: response.status, text };
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
