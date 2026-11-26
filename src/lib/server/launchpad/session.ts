import { MAIN_LAUNCHPAD_COOKIE_NAME } from "$app/env/private";
import { getRequestEvent } from "$app/server";

export function getCurrentUserHeaders() {
  const sessionCookie = getRequestEvent().cookies.get(
    MAIN_LAUNCHPAD_COOKIE_NAME,
  );
  return sessionCookie
    ? { cookie: `${MAIN_LAUNCHPAD_COOKIE_NAME}=${sessionCookie}` }
    : undefined;
}
