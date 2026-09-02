import { describe, expect, it } from "vitest";
import { toSourcePackageListRow } from "./toSourcePackageListRow.js";
import type { SourcePackagePublishingEntry } from "./types.js";

function entry(
  overrides: Partial<SourcePackagePublishingEntry> = {},
): SourcePackagePublishingEntry {
  return {
    self_link:
      "https://lp.example/api/devel/ubuntu/+archive/primary/+sourcepub/1",
    resource_type_link:
      "https://lp.example/api/devel/#source_package_publishing_history",
    display_name: "0ad 0.28.0-3 in resolute",
    source_package_name: "0ad",
    source_package_version: "0.28.0-3",
    status: "Published",
    pocket: "Release",
    component_name: "universe",
    section_name: "games",
    distro_series_link: "https://lp.example/api/devel/ubuntu/resolute",
    archive_link: "https://lp.example/api/devel/ubuntu/+archive/primary",
    date_published: "2026-02-25T15:38:34.905768+00:00",
    date_created: "2026-02-25T13:52:22.996244+00:00",
    date_superseded: null,
    date_made_pending: null,
    date_removed: null,
    published_binaries: [],
    ...overrides,
  };
}

describe("toSourcePackageListRow", () => {
  it("maps entry fields and derives the series from its link", () => {
    const row = toSourcePackageListRow(entry());
    expect(row.sourcePackage).toEqual({
      id: entry().self_link,
      name: "0ad",
      latestVersion: "0.28.0-3",
    });
    expect(row.status).toBe("Published");
    expect(row.pocket).toBe("Release");
    expect(row.component).toBe("universe");
    expect(row.series).toEqual({ name: "resolute", displayName: "Resolute" });
  });

  it("dedupes published binaries across architectures", () => {
    const row = toSourcePackageListRow(
      entry({
        published_binaries: [
          {
            binary_package_name: "0ad",
            architecture_tag: "amd64",
            status: "Published",
            pocket: "Release",
            date_created: null,
            date_made_pending: null,
            date_superseded: null,
            date_removed: null,
            web_link: "https://lp.example/+bin/1",
            build_status: "Successfully built",
            build_web_link: "https://lp.example/+build/1",
          },
          {
            binary_package_name: "0ad",
            architecture_tag: "arm64",
            status: "Published",
            pocket: "Release",
            date_created: null,
            date_made_pending: null,
            date_superseded: null,
            date_removed: null,
            web_link: "https://lp.example/+bin/2",
            build_status: "Successfully built",
            build_web_link: "https://lp.example/+build/2",
          },
          {
            binary_package_name: "0ad-data",
            architecture_tag: "amd64",
            status: "Published",
            pocket: "Release",
            date_created: null,
            date_made_pending: null,
            date_superseded: null,
            date_removed: null,
            web_link: "https://lp.example/+bin/3",
            build_status: "Successfully built",
            build_web_link: "https://lp.example/+build/3",
          },
        ],
      }),
    );
    expect(row.binaryPackages).toEqual([{ name: "0ad" }, { name: "0ad-data" }]);
  });
});
