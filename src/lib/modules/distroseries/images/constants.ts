import { slugify } from "$lib/utils/slugify";

export const DEFAULT_TABLE_VIEWS = [
  { name: "All packages", editable: false },
  { name: "Failed to build", editable: true },
  { name: "Failed testing", editable: true },
].map(({ name, editable }) => ({ name, slug: slugify(name), editable }));

export const DEFAULT_TABLE_VIEW_SLUG = DEFAULT_TABLE_VIEWS[0].slug;

export const MANAGE_VIEWS_PANEL = "manage-views";

export const PRODUCTS = [
  { name: "Edubuntu" },
  { name: "Kubuntu" },
  { name: "Lubuntu" },
  { name: "Ubuntu" },
  { name: "Ubuntu Base" },
  { name: "Ubuntu Budgie" },
  { name: "Ubuntu Cinnamon" },
  { name: "Ubuntu Core" },
  { name: "Ubuntu Core Installer" },
  { name: "Ubuntu Kylin" },
  { name: "Ubuntu Mate" },
  { name: "Ubuntu Mini ISO" },
  { name: "Ubuntu Server" },
  { name: "Ubuntu Studio" },
  { name: "Ubuntu Unity" },
  { name: "Ubuntu WSL" },
  { name: "Xubuntu" },
].map(({ name }) => ({ name, slug: slugify(name) }));

export const BUILD_STATUSES = ["successful", "failed", "running"] as const;
export const TEST_STATUSES = ["passed", "failed", "running"] as const;

export const DEFAULT_PAGE_SIZE = 25;
export const MAX_PAGE_SIZE = 100;

export const IMAGES_TABLE_COLUMNS = [
  { key: "image-name", label: "Image name", sortable: true },
  { key: "build-status", label: "Build status", sortable: false },
  { key: "test-status", label: "Test status", sortable: false },
  { key: "bugs", label: "Bugs", sortable: false },
  { key: "version", label: "Version", sortable: true },
  { key: "download", label: "Download", sortable: false },
] as const satisfies readonly {
  key: string;
  label: string;
  sortable: boolean;
}[];

export const SORTABLE_IMAGES_TABLE_COLUMNS = IMAGES_TABLE_COLUMNS.flatMap(
  (column) => (column.sortable ? [column.key] : []),
);
