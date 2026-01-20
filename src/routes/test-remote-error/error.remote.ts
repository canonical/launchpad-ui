import { query } from "$app/server";

// https://github.com/sveltejs/kit/issues/14808
// https://github.com/sveltejs/kit/issues/14398

export const throwError = query(async () => {
  throw new Error("Test remote error");
});
