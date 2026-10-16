import type { BUILD_STATUSES, PRODUCTS, TEST_STATUSES } from "./constants";

export type Product = (typeof PRODUCTS)[number]["slug"];
export type BuildStatus = (typeof BUILD_STATUSES)[number];
export type TestStatus = (typeof TEST_STATUSES)[number];
