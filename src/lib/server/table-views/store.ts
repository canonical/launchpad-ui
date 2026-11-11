import type { TableView as ImagesTableview } from "../../modules/distroseries/images/table-views/constants.js";
import type { TableView as PackagesTableView } from "../../modules/packages/table-views/constants.js";

/** Views are stored per user and per distro, as each distro has its own series. */
export interface TableViewsStore<
  T extends ImagesTableview | PackagesTableView,
> {
  get(userId: string, distro: string): Promise<T[]>;
  set(userId: string, distro: string, views: T[]): Promise<void>;
}

export function createInMemoryTableViewsStore<
  T extends ImagesTableview | PackagesTableView,
>(
  defaultViews: T[],
  { maxEntries = 10_000 }: { maxEntries?: number } = {},
): TableViewsStore<T> {
  const viewsByKey = new Map<string, T[]>();
  // Launchpad names can't contain a slash, so the key is unambiguous
  const toKey = (userId: string, distro: string) => `${userId}/${distro}`;

  return {
    async get(userId, distro) {
      const key = toKey(userId, distro);
      const views = viewsByKey.get(key);
      if (views === undefined) return structuredClone(defaultViews);

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
