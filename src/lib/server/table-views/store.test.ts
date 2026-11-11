import { describe, expect, it } from "vitest";
import { DEFAULT_TABLE_VIEWS as DEFAULT_IMAGES_TABLE_VIEWS } from "../../modules/distroseries/images/table-views/constants.js";
import { DEFAULT_TABLE_VIEWS as DEFAULT_PACKAGES_TABLE_VIEWS } from "../../modules/packages/table-views/constants.js";
import { createInMemoryTableViewsStore } from "./store.js";

describe("createInMemoryTableViewsStore", () => {
  it("keeps package and image views in independent stores", async () => {
    const packagesStore = createInMemoryTableViewsStore(
      DEFAULT_PACKAGES_TABLE_VIEWS,
    );
    const imagesStore = createInMemoryTableViewsStore(
      DEFAULT_IMAGES_TABLE_VIEWS,
    );
    const userId = "user";
    const distro = "ubuntu";

    const packagesViews = await packagesStore.get(userId, distro);
    const imagesViews = await imagesStore.get(userId, distro);

    await packagesStore.set(userId, distro, packagesViews.slice(1));

    expect(await packagesStore.get(userId, distro)).toHaveLength(
      packagesViews.length - 1,
    );
    expect(await imagesStore.get(userId, distro)).toEqual(imagesViews);
  });
});
