import { DEFAULT_TABLE_VIEWS } from "../../modules/packages/table-views/constants.js";
import type { TableView } from "../../modules/packages/table-views/constants.js";

/** Views are stored per user and per distro, as each distro has its own series. */
export interface TableViewsStore {
  get(userId: string, distro: string): Promise<TableView[]>;
  set(userId: string, distro: string, views: TableView[]): Promise<void>;
}

export function createInMemoryTableViewsStore({
  maxEntries = 10_000,
}: { maxEntries?: number } = {}): TableViewsStore {
  const viewsByKey = new Map<string, TableView[]>();
  // Launchpad names can't contain a slash, so the key is unambiguous
  const toKey = (userId: string, distro: string) => `${userId}/${distro}`;

  return {
    async get(userId, distro) {
      const key = toKey(userId, distro);
      const views = viewsByKey.get(key);
      if (views === undefined) return structuredClone(DEFAULT_TABLE_VIEWS);

      viewsByKey.delete(key);
      viewsByKey.set(key, views);
      return structuredClone(views);
    },
    async set(userId, distro, views) {
      const key = toKey(userId, distro);
      viewsByKey.delete(key);
      viewsByKey.set(key, structuredClone(views));

      while (viewsByKey.size > maxEntries) {
        const oldestKey = viewsByKey.keys().next().value;
        if (oldestKey === undefined) break;
        viewsByKey.delete(oldestKey);
      }
    },
  };
}
