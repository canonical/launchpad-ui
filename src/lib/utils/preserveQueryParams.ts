// Remote form submissions preserve query params automatically in Kit v3 (https://github.com/sveltejs/kit/pull/16373)
// TODO: Remove this once upgraded.

import type { RemoteForm, RemoteFormInput } from "@sveltejs/kit";

type RemoteFormProps = ReturnType<
  RemoteForm<RemoteFormInput, unknown>["enhance"]
>;

/**
 * Adds `url`'s query params to the `action` of a remote form, or of its `.enhance()` result.
 *
 * Kit's action is `?/remote=…`, so a no-JS submission otherwise re-renders the page without its query params.
 */
export function preserveQueryParams(
  form: RemoteFormProps,
  url: URL,
): RemoteFormProps {
  const action = new URL(form.action, url);
  const preserved = new URLSearchParams(url.search);
  for (const name of action.searchParams.keys()) preserved.delete(name);

  if (preserved.size === 0) return form;

  return { ...form, action: `?${preserved}&${action.search.slice(1)}` };
}
