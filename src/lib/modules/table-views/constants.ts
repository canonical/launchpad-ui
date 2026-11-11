export const MAX_TABLE_VIEW_NAME_LENGTH = 100;

export const ADD_TABLE_VIEW_MODES = ["new", "bookmark"] as const;
export type AddTableViewMode = (typeof ADD_TABLE_VIEW_MODES)[number];
