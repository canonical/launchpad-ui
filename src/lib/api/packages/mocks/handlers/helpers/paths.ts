export const PACKAGES_API = "*/api/packages";
export const PACKAGES_API_WILDCARD = `${PACKAGES_API}/*`;

export const templateFromHandlerPath = (path: string): string =>
  path.replace(PACKAGES_API, "").replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, "{$1}");
