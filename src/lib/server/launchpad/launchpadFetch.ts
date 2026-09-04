import { Agent, request as undiciRequest } from "undici";
import { env } from "$env/dynamic/private";

export async function launchpadFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const requestUrl = new URL(input instanceof Request ? input.url : input);
  const baseHost = env.MAIN_LAUNCHPAD_BASE_HOST;
  const ipAddress = env.MAIN_LAUNCHPAD_IP_ADDRESS;
  const baseOrigin = baseHost ? new URL(baseHost).origin : null;

  const headers: Record<string, string> = {};
  new Headers(init?.headers).forEach((value, key) => {
    headers[key] = value;
  });

  let url = requestUrl;
  if (ipAddress && baseOrigin && requestUrl.origin === baseOrigin) {
    url = new URL(requestUrl.pathname + requestUrl.search, ipAddress);
    // fetch() treats `Host` as a forbidden header and silently drops it,
    // breaking vhost routing when connecting to an IP address.
    // undici.request() does not enforce the Fetch spec's forbidden-header list.
    headers["host"] = new URL(baseOrigin).host;
  }

  const res = await undiciRequest(url, {
    method: init?.method ?? "GET",
    headers,
    dispatcher:
      env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === "true"
        ? new Agent({ connect: { rejectUnauthorized: false } })
        : undefined,
  });

  const responseHeaders = new Headers();
  for (const [key, value] of Object.entries(res.headers)) {
    if (value !== undefined) {
      responseHeaders.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }

  const text = await res.body.text();
  return new Response(text === "" ? null : text, {
    status: res.statusCode,
    headers: responseHeaders,
  });
}
