import type {
  BinaryPackageDetails,
  SourcePackageList,
} from "$lib/server/launchpad/types.js";

export function packageListing(
  overrides: Partial<SourcePackageList> = {},
): SourcePackageList {
  return {
    total: 1,
    total_pages: 1,
    page: 1,
    page_size: 25,
    sources: [
      {
        id: 1,
        source_package_name: "firefox",
        source_package_version: "1.0",
        series: "noble",
        pocket: "Release",
        status: "Published",
        binaries_total: 2,
        binaries: [
          { name: "firefox", id: 101 },
          { name: "firefox-locale", id: 102 },
        ],
      },
    ],
    ...overrides,
  };
}

export function binaryDetails(
  overrides: Partial<BinaryPackageDetails> = {},
): BinaryPackageDetails {
  return {
    id: 101,
    binary_package_name: "firefox",
    binary_package_version: "1.0",
    summary: "Mozilla Firefox web browser",
    description: "A web browser.",
    files: [
      {
        filename: "firefox_1.0_amd64.deb",
        size: 1024,
        url: "https://launchpad.test/ubuntu/+archive/primary/+files/firefox_1.0_amd64.deb",
      },
    ],
    ...overrides,
  };
}
