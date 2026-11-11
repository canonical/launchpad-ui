import { DEFAULT_TABLE_VIEWS as DEFAULT_IMAGES_TABLE_VIEWS } from "../../modules/distroseries/images/table-views/constants.js";
import { DEFAULT_TABLE_VIEWS as DEFAULT_PACKAGES_TABLE_VIEWS } from "../../modules/packages/table-views/constants.js";
import { createInMemoryTableViewsStore } from "./store.js";

export const tableViewsStore = createInMemoryTableViewsStore(
  DEFAULT_PACKAGES_TABLE_VIEWS,
);
export const imagesTableViewsStore = createInMemoryTableViewsStore(
  DEFAULT_IMAGES_TABLE_VIEWS,
);
