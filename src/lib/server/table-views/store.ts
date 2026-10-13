import { DEFAULT_TABLE_VIEWS } from "../../modules/packages/table-views/constants.js";
import type { TableView } from "../../modules/packages/table-views/constants.js";

export interface TableViewsStore {
  get(userId: string): Promise<TableView[]>;
  set(userId: string, views: TableView[]): Promise<void>;
}

export function createInMemoryTableViewsStore({
  maxEntries = 10_000,
}: { maxEntries?: number } = {}): TableViewsStore {
  const viewsByUserId = new Map<string, TableView[]>();

  return {
    async get(userId) {
      const views = viewsByUserId.get(userId);
      if (views === undefined) return structuredClone(DEFAULT_TABLE_VIEWS);

      viewsByUserId.delete(userId);
      viewsByUserId.set(userId, views);
      return structuredClone(views);
    },
    async set(userId, views) {
      viewsByUserId.delete(userId);
      viewsByUserId.set(userId, structuredClone(views));

      while (viewsByUserId.size > maxEntries) {
        const oldestUserId = viewsByUserId.keys().next().value;
        if (oldestUserId === undefined) break;
        viewsByUserId.delete(oldestUserId);
      }
    },
  };
}
