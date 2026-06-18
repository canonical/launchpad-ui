import { error } from "@sveltejs/kit";
import { Agent, request as undiciRequest } from "undici";
import * as v from "valibot";
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

  const ipAddress = env.MAIN_LAUNCHPAD_IP_ADDRESS;
  const url = new URL(path, ipAddress || baseHost);

  const headers: Record<string, string> = {};
  if (ipAddress) {
    headers["host"] = new URL(baseHost).host;
  }
  if (lpCookie) {
    headers["cookie"] = `${lpCookieName}=${lpCookie}`;
  }

  const skipTLS = env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === "true";

  const loggableHeaders = { ...headers };
  if (loggableHeaders.cookie) {
    loggableHeaders.cookie = `<${lpCookieName}>`;
  }

  const logContext = { url: url.toString(), headers: loggableHeaders, skipTLS };

  let statusCode: number;
  let text: string;
  try {
    console.log("Launchpad request started", logContext);

    const MAX_REDIRECTS = 5;
    const baseOrigin = new URL(baseHost).origin;
    let currentUrl: URL = url;

    for (let redirects = 0; ; redirects++) {
      // fetch() treats `Host` as a forbidden header and silently drops it,
      // breaking vhost routing when connecting to an IP address.
      // undici.request() does not enforce the Fetch spec's forbidden-header list.
      const res = await undiciRequest(currentUrl, {
        headers,
        dispatcher: skipTLS
          ? new Agent({ connect: { rejectUnauthorized: false } })
          : undefined,
      });

      const isRedirect = res.statusCode >= 300 && res.statusCode < 400;
      if (isRedirect && redirects < MAX_REDIRECTS) {
        const location = Array.isArray(res.headers.location)
          ? res.headers.location[0]
          : res.headers.location;
        await res.body.dump();

        if (!location) {
          statusCode = res.statusCode;
          text = "";
          break;
        }

        let next = new URL(location, currentUrl);
        // LP redirects use the canonical hostname; rewrite back to IP so the
        // Host header override keeps working on every hop.
        if (ipAddress && next.origin === baseOrigin) {
          next = new URL(next.pathname + next.search, ipAddress);
        }
        currentUrl = next;
        continue;
      }

      statusCode = res.statusCode;
      text = await res.body.text();
      break;
    }

    console.log("Launchpad request finished successfully", {
      ...logContext,
      status: statusCode,
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
    const json = JSON.parse(text);
    return { status: statusCode, json };
  } catch {
    return { status: statusCode, text };
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
