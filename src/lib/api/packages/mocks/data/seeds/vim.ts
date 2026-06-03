import { MAINTAINERS } from "../maintainers.js";
import { lp } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

export const vim: SourcePackageSeed = {
  details: {
    id: "vim",
    name: "vim",
    description:
      "Vi IMproved — enhanced vi editor. Vim is an almost compatible version of the UNIX editor Vi. Many new features have been added: multi-level undo, syntax highlighting, command-line history, on-line help, filename completion, block operations, folding, Unicode support, etc.\n\nVim is extensible with its own scripting language (Vimscript) and exposes bindings to Python, Ruby, Lua, and Perl. The package is split into multiple binaries — tiny, basic, GTK, and Nox — to match different runtime needs, from minimal recovery shells to full-featured graphical editing.",
    maintainer: MAINTAINERS.kaiTanaka,
    urgency: "Low",
    architectures: ["amd64", "arm64", "armhf", "ppc64el", "riscv64", "s390x"],
    openBugCount: 22,
    openQuestionsCount: 2,
    changeLogCount: 154,
    changelogUrl: lp("/ubuntu/+source/vim/+changelog"),
    pendingUploads: 0,
  },
  listing: {
    status: "Published",
    pocket: "Release",
    component: "main",
    latestVersionId: "vim-2-9-2080-1ubuntu1",
    seriesKey: "resolute",
  },
  latestVersion: "2:9.2.080-1ubuntu1",
  versions: [
    {
      version: "2:9.2.080-1ubuntu1",
      series: "resolute",
      status: "Published",
      pocket: "Release",
      component: "main",
      section: "editors",
      uploadDateTime: "2026-03-29T17:11:00Z",
      uploader: "kaiTanaka",
      publishedOn: "2026-03-29",
      isCurrent: true,
    },
    {
      version: "2:9.1.0888-1ubuntu1",
      series: "noble",
      status: "Published",
      pocket: "Updates",
      component: "main",
      section: "editors",
      uploadDateTime: "2025-07-14T13:00:00Z",
      uploader: "kaiTanaka",
      publishedOn: "2025-07-14",
      isCurrent: true,
    },
  ],
  binaryPackageNames: ["vim", "vim-tiny", "vim-gtk3", "vim-nox", "vim-doc"],
  binariesGroup: {
    title: "vim binary packages",
    description:
      "Vi IMproved editor — multiple flavors (tiny, common, gtk3, nox) built from the vim source package.",
    artifacts: [
      {
        id: "vim-resolute-amd64-release",
        name: "vim",
        version: "2:9.2.080-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
      {
        id: "vim-tiny-resolute-amd64-release",
        name: "vim-tiny",
        version: "2:9.2.080-1ubuntu1",
        architecture: "amd64",
        status: "Published",
      },
    ],
  },
  relationships: {
    dependedOn: [{ name: "vim-common" }, { name: "vim-runtime" }],
    recommends: [],
    suggests: [{ name: "ctags" }, { name: "vim-doc" }],
    conflicts: [],
    dependedBy: [],
    recommendedBy: [],
    suggestedBy: [],
  },
  ppaVersions: [],
  bugs: [
    {
      id: "2084122",
      title: "GTK3 GUI: clipboard integration breaks on Wayland",
      importance: "Medium",
      status: "Confirmed",
    },
  ],
  cves: [],
  mergeProposals: [],
  upstream: {
    homepage: "https://www.vim.org/",
    repositoryUrl: "https://github.com/vim/vim",
    bugTrackerUrl: "https://github.com/vim/vim/issues",
    latestRelease: {
      version: "9.2.080",
      releasedAt: "2026-03-26",
      url: "https://github.com/vim/vim/releases/tag/v9.2.0080",
    },
    contacts: [{ name: "Bram Moolenaar Foundation", role: "upstream" }],
  },
  debian: {
    trackerUrl: "https://tracker.debian.org/pkg/vim",
    btsUrl: "https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=vim",
    latestDebianVersion: "2:9.2.080-2",
    latestDebianSeries: "trixie",
    openBugCount: 18,
  },
  source: {
    distribution: "ubuntu",
    packageName: "vim",
    url: lp("/ubuntu/+source/vim"),
  },
  versionUpstream: [
    {
      name: "Vim",
      url: "https://www.vim.org/",
    },
  ],
};
