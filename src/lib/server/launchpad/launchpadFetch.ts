import { Readable } from "node:stream";
import { Agent, request as undiciRequest } from "undici";
import type { Dispatcher } from "undici";
import { env } from "$env/dynamic/private";

const insecureAgent = new Agent({ connect: { rejectUnauthorized: false } });

export async function launchpadFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await requestLaunchpad(input, init);
  const text = await res.body.text();
  return new Response(text === "" ? null : text, {
    status: res.statusCode,
    headers: responseHeaders(res),
  });
}

export async function launchpadFetchStream(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const res = await requestLaunchpad(input, init);
  return new Response(Readable.toWeb(res.body) as ReadableStream<Uint8Array>, {
    status: res.statusCode,
    headers: responseHeaders(res),
  });
}

async function requestLaunchpad(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Dispatcher.ResponseData> {
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

  return undiciRequest(url, {
    method: init?.method ?? "GET",
    headers,
    dispatcher:
      env.MAIN_LAUNCHPAD_SKIP_TLS_VERIFY === "true" ? insecureAgent : undefined,
  });
}

function responseHeaders(res: Dispatcher.ResponseData): Headers {
  const headers = new Headers();
  for (const [key, value] of Object.entries(res.headers)) {
    if (value !== undefined) {
      headers.set(key, Array.isArray(value) ? value.join(", ") : value);
    }
  }
  return headers;
}
