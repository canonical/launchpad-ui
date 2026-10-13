import type { RequestEvent } from "@sveltejs/kit";

const USER_ID_COOKIE = "anon-user-id";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function resolveUser({ cookies }: RequestEvent) {
  const userId = cookies.get(USER_ID_COOKIE);
  if (userId) return { id: userId };

  const newUserId = crypto.randomUUID();
  cookies.set(USER_ID_COOKIE, newUserId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
  });
  return { id: newUserId };
}
