import { http } from "msw";
import type { HttpHandler } from "msw";
import { PACKAGES_API, PACKAGES_API_WILDCARD } from "./helpers/paths.js";
import {
  methodNotAllowedResponse,
  notFoundResponse,
} from "./helpers/responses.js";
import { safeWrap } from "./helpers/wrap.js";

const REGEX_METACHARS = /[.*+?^${}()|[\]\\]/g;

const patternToPathRegex = (pattern: string): RegExp => {
  const withoutHost = pattern.startsWith("*/") ? pattern.slice(1) : pattern;
  const parts = withoutHost.split(/(:[a-zA-Z_][a-zA-Z0-9_]*)/);
  const compiled = parts
    .map((part, i) =>
      i % 2 === 1 ? "[^/]+" : part.replace(REGEX_METACHARS, "\\$&"),
    )
    .join("");
  return new RegExp(`^${compiled}$`);
};

const isWildcardPattern = (pattern: string): boolean =>
  pattern === PACKAGES_API_WILDCARD || pattern.endsWith("/*");

/**
 * Tail-of-array wildcard. Distinguishes 404 (unknown template) from 405
 * (known template, unsupported method). `getHandlers` is invoked per-request
 * so handlers added via `server.use(...)` are also considered.
 */
export const createFallbackHandler = (
  getHandlers: () => readonly HttpHandler[],
): HttpHandler =>
  http.all(
    PACKAGES_API_WILDCARD,
    safeWrap(({ request }) => {
      const pathname = new URL(request.url).pathname;
      const method = request.method.toUpperCase();

      const known = getHandlers()
        .filter((h) => !isWildcardPattern(h.info.path as string))
        .filter((h) => (h.info.path as string).startsWith(PACKAGES_API))
        .map((h) => ({
          method: (h.info.method as string).toUpperCase(),
          regex: patternToPathRegex(h.info.path as string),
        }));

      const matchingTemplates = known.filter((r) => r.regex.test(pathname));
      if (matchingTemplates.length === 0) {
        return notFoundResponse(
          `No handler registered for ${method} ${pathname}`,
        );
      }
      if (matchingTemplates.every((r) => r.method !== method)) {
        return methodNotAllowedResponse(
          `Method ${method} not allowed on ${pathname}`,
        );
      }
      // Matching template + matching method: a typed handler should have
      // already responded. Reaching here is a bug; let MSW surface it.
      return undefined;
    }),
  );
