/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  createFinalURL,
  createQuerySerializer,
  removeTrailingSlash,
} from "openapi-fetch";
import type {
  PathsWithMethod,
  RequiredKeysOf,
} from "openapi-typescript-helpers";

type PickQueryAndOrPath<T> = Pick<T, Extract<keyof T, "query" | "path">>;

type HrefParams<
  Paths extends Record<string, Record<"get", {}>>,
  Path extends PathsWithMethod<Paths, "get">,
> = Paths[Path]["get"] extends { parameters: infer Params }
  ? RequiredKeysOf<PickQueryAndOrPath<Params>> extends never
    ? [params?: PickQueryAndOrPath<Params>]
    : [params: PickQueryAndOrPath<Params>]
  : [params?: undefined];

type Href<Paths extends Record<string, Record<"get", {}>>> = <
  Path extends PathsWithMethod<Paths, "get">,
>(
  path: Path,
  ...params: HrefParams<Paths, Path>
) => string;

export function createHrefClient<Paths extends {}>(clientOptions?: {
  baseUrl?: string;
}) {
  const href: Href<Paths> = (path, params = undefined) => {
    return createFinalURL(path as string, {
      baseUrl: removeTrailingSlash(clientOptions?.baseUrl ?? ""),
      params: params ?? {},
      querySerializer: createQuerySerializer(),
    });
  };

  return href;
}
