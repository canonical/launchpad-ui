import { Agent, Pool, buildConnector } from "undici";

/**
 * Customize connections for one logical origin without rewriting request URLs.
 * Host and TLS SNI retain the logical hostname; other origins use normal pools.
 * @note Creates shared connection pools intended to live with the server client.
 */
export default function createDispatcher({
  baseUrl,
  connectTo,
  rejectUnauthorized = true,
}: {
  baseUrl: string;
  connectTo?: string;
  rejectUnauthorized?: boolean;
}): Agent {
  const origin = new URL(baseUrl).origin;
  const address = connectTo ? new URL(connectTo) : undefined;
  if (
    address &&
    (!["http:", "https:"].includes(address.protocol) ||
      address.username ||
      address.password ||
      address.pathname !== "/" ||
      address.search ||
      address.hash)
  ) {
    throw new TypeError(
      "MAIN_LAUNCHPAD_IP_ADDRESS must be an HTTP(S) origin without credentials, path, query or fragment",
    );
  }
  const destination = address
    ? {
        hostname: address.hostname.startsWith("[")
          ? address.hostname.slice(1, -1)
          : address.hostname,
        port: address.port || (address.protocol === "https:" ? "443" : "80"),
        protocol: address.protocol,
      }
    : undefined;
  const connect = buildConnector({ rejectUnauthorized });

  return new Agent({
    factory(poolOrigin, options) {
      if (new URL(poolOrigin).origin !== origin) {
        return new Pool(poolOrigin, options);
      }
      return new Pool(poolOrigin, {
        ...options,
        connect: (connection, callback) =>
          connect({ ...connection, ...destination }, callback),
      });
    },
  });
}
