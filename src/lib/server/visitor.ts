import type { RequestEvent } from "@sveltejs/kit";
import { getRequestEvent } from "$app/server";

const VISITOR_ID_COOKIE = "anon-user-id";
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function resolveVisitor({ cookies }: RequestEvent) {
  const visitorId = cookies.get(VISITOR_ID_COOKIE);
  if (visitorId) return { id: visitorId };

  const newVisitorId = crypto.randomUUID();
  cookies.set(VISITOR_ID_COOKIE, newVisitorId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ONE_YEAR_IN_SECONDS,
  });
  return { id: newVisitorId };
}

export function getVisitorId() {
  return getRequestEvent().locals.visitor.id;
}
