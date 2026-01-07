import { form, getRequestEvent, query } from "$app/server";

export const getCookie = query(cookie.name, () => {
  const { cookies } = getRequestEvent();
  return cookies.get(cookie.name);
});

export const setCookie = form(cookie.schema, (value) => {
  const { cookies } = getRequestEvent();
  cookies.set(cookie.name, value, cookie.options);
});
