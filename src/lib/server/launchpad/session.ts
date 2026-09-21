import { getRequestEvent } from "$app/server";
import { env } from "$env/dynamic/private";

export function getSessionCookie(): string | undefined {
  return getRequestEvent().cookies.get(env.MAIN_LAUNCHPAD_COOKIE_NAME || "lp");
}
