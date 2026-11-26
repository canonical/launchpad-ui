import { LaunchpadApiError } from "@canonical/launchpad-client";
import type { LaunchpadResponse } from "@canonical/launchpad-client";
import { error } from "@sveltejs/kit";
import * as v from "valibot";
import { sql } from "#lib/server/db.js";
import { launchpadClient } from "#lib/server/launchpad/client.js";
import { MAIN_LAUNCHPAD_COOKIE_NAME as lpCookieName } from "$app/env/private";
import { form, getRequestEvent, query } from "$app/server";

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

export const getDatabase = query(async (): Promise<ConnectionResponse> => {
  // TODO: Remove once the connection string is required (https://warthogs.atlassian.net/browse/LP-5243)
  if (!sql) return { status: "Not configured", text: "", isError: false };
  try {
    const [row] = await sql<{ database: string; majorVersion: number }[]>`
      select current_database() as database,
             current_setting('server_version_num')::int / 10000 as "majorVersion"`;
    return {
      status: `Connected to ${row.database}`,
      text: `PostgreSQL ${row.majorVersion}`,
      isError: false,
    };
  } catch (queryError) {
    console.error(
      "Database query failed",
      queryError instanceof Error ? queryError.message : String(queryError),
    );
    return {
      status: `Query failed: ${errorCode(queryError)}`,
      text: "",
      isError: true,
    };
  }
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
    const common = {
      status: `HTTP status: ${response.status}`,
      isError: !response.ok,
    };
    return /\bjson\b/i.test(response.headers.get("content-type") ?? "")
      ? { ...common, json: data }
      : {
          ...common,
          text: typeof data === "string" ? data : "",
        };
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

function errorCode(error: unknown) {
  return error instanceof Error && "code" in error
    ? String(error.code)
    : "unknown";
}

export type ConnectionResponse =
  | { status: string; isError: boolean; json: unknown }
  | { status: string; isError: boolean; text: string };
