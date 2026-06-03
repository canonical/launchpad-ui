import type {
  Architecture,
  Component,
  PackageBug,
  PackageCve,
  PackageRef,
  Pocket,
  PpaVersion,
  PublishingStatus,
  SourcePackageBinariesGroup,
  Urgency,
} from "../../../types.js";
import { MAINTAINERS } from "../maintainers.js";
import { DEFAULT_ARCHES, lp, versionSlug } from "../shared.js";
import type { SourcePackageSeed } from "../types.js";

type MaintainerId =
  | "ubuntuDevelopers"
  | "avaNovak"
  | "kaiTanaka"
  | "ninaHolt"
  | "omarFaruk";

export type ExtraSpec = {
  name: string;
  description: string;
  maintainerId: MaintainerId;
  urgency: Urgency;
  latestVersion: string;
  /** ISO UTC timestamp of the resolute upload. */
  uploadDateTime: string;
  /** Defaults to `maintainerId` when omitted. */
  uploader?: MaintainerId;
  nobleVersion?: string;
  nobleUploader?: MaintainerId;
  nobleUploadDate?: string;
  noblePocket?: Pocket;
  section: string;
  component: Component;
  pocket: Pocket;
  /** Binary package names produced by this source. ≥1 required. */
  binaries: string[];
  /** Defaults to `["amd64","arm64","armhf","ppc64el","riscv64","s390x"]`. */
  architectures?: Architecture[];
  binariesDescription?: string;
  openBugCount?: number;
  openQuestionsCount?: number;
  changeLogCount?: number;
  homepage?: string;
  repositoryUrl?: string;
  bugTrackerUrl?: string;
  upstreamContacts?: Array<{ name: string; role: string; url?: string }>;
  dependedOn?: PackageRef[];
  recommends?: PackageRef[];
  suggests?: PackageRef[];
  conflicts?: PackageRef[];
  dependedBy?: PackageRef[];
  ppaVersions?: PpaVersion[];
  bugs?: PackageBug[];
  cves?: PackageCve[];
  debianOpenBugCount?: number;
};

const NO_ARMHF: Architecture[] = [
  "amd64",
  "arm64",
  "ppc64el",
  "riscv64",
  "s390x",
];

export const EXTRA_SPECS: readonly ExtraSpec[] = [
  // ---- shells / terminal tools ----------------------------------------
  {
    name: "tmux",
    description:
      "Terminal multiplexer — tmux is a program which runs in a terminal and allows multiple other terminals to be run inside it.",
    maintainerId: "omarFaruk",
    urgency: "Low",
    latestVersion: "3.5a-3",
    uploadDateTime: "2026-04-22T09:00:00Z",
    section: "admin",
    component: "main",
    pocket: "Release",
    binaries: ["tmux"],
    changeLogCount: 92,
    homepage: "https://tmux.github.io/",
    repositoryUrl: "https://github.com/tmux/tmux",
    bugTrackerUrl: "https://github.com/tmux/tmux/issues",
    openBugCount: 3,
  },
  {
    name: "zsh",
    description:
      "Shell with lots of features — Z shell is a powerful interactive login shell and a command interpreter for shell scripting.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "5.10-3ubuntu1",
    uploadDateTime: "2026-03-30T14:11:00Z",
    section: "shells",
    component: "main",
    pocket: "Release",
    binaries: ["zsh", "zsh-common", "zsh-doc", "zsh-static"],
    changeLogCount: 184,
    homepage: "https://www.zsh.org/",
    openBugCount: 11,
  },
  {
    name: "fish",
    description:
      "Friendly Interactive SHell — fish is a fully equipped command line shell with extensive features that focus on user friendliness.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "3.7.1-1",
    uploadDateTime: "2026-02-15T11:00:00Z",
    section: "shells",
    component: "universe",
    pocket: "Release",
    binaries: ["fish", "fish-common"],
    changeLogCount: 47,
    homepage: "https://fishshell.com/",
  },
  {
    name: "dash",
    description:
      "POSIX-compliant shell — dash is a POSIX-compliant implementation of /bin/sh that aims to be as small as possible.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "0.5.12-9",
    uploadDateTime: "2026-01-22T08:00:00Z",
    section: "shells",
    component: "main",
    pocket: "Release",
    binaries: ["dash"],
    changeLogCount: 56,
    openBugCount: 2,
  },
  // ---- editors --------------------------------------------------------
  {
    name: "neovim",
    description:
      "Heavily refactored vim fork — Neovim is a project that seeks to aggressively refactor Vim with a goal of enabling new applications and improving extensibility and maintainability.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "0.10.4-2",
    uploadDateTime: "2026-05-02T12:30:00Z",
    section: "editors",
    component: "universe",
    pocket: "Release",
    binaries: ["neovim", "neovim-runtime"],
    changeLogCount: 71,
    homepage: "https://neovim.io/",
    repositoryUrl: "https://github.com/neovim/neovim",
    openBugCount: 18,
  },
  {
    name: "emacs",
    description:
      "GNU Emacs editor (metapackage) — Emacs is an extensible, customizable, self-documenting real-time display editor.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "1:30.1+1-1",
    uploadDateTime: "2026-04-18T16:00:00Z",
    section: "editors",
    component: "main",
    pocket: "Release",
    binaries: [
      "emacs",
      "emacs-gtk",
      "emacs-nox",
      "emacs-common",
      "emacs-bin-common",
    ],
    changeLogCount: 132,
    homepage: "https://www.gnu.org/software/emacs/",
    openBugCount: 9,
  },
  {
    name: "nano",
    description:
      "Small, friendly text editor inspired by Pico — nano is an easy-to-use console editor designed to be a free replacement for Pico.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "8.4-1",
    uploadDateTime: "2026-04-01T08:30:00Z",
    section: "editors",
    component: "main",
    pocket: "Release",
    binaries: ["nano"],
    changeLogCount: 64,
  },
  // ---- utilities ------------------------------------------------------
  {
    name: "htop",
    description:
      "Interactive processes viewer — htop is an interactive process viewer for Unix systems with a colour interface, vi-style key bindings, and process tree view.",
    maintainerId: "omarFaruk",
    urgency: "Low",
    latestVersion: "3.3.0-5",
    uploadDateTime: "2026-02-12T10:00:00Z",
    section: "utils",
    component: "main",
    pocket: "Release",
    binaries: ["htop"],
    changeLogCount: 38,
  },
  {
    name: "jq",
    description:
      "Lightweight and flexible command-line JSON processor — jq is like sed for JSON data — you can use it to slice, filter, map, and transform structured data.",
    maintainerId: "omarFaruk",
    urgency: "Low",
    latestVersion: "1.7.1-4",
    uploadDateTime: "2026-01-15T13:00:00Z",
    section: "utils",
    component: "main",
    pocket: "Release",
    binaries: ["jq", "libjq1", "libjq-dev"],
    changeLogCount: 24,
    homepage: "https://jqlang.github.io/jq/",
  },
  {
    name: "ripgrep",
    description:
      "Recursively search directories for a regex pattern — ripgrep is a line-oriented search tool that combines the speed of GNU grep with the usability of The Silver Searcher.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "14.1.1-2",
    uploadDateTime: "2026-03-22T18:00:00Z",
    section: "utils",
    component: "universe",
    pocket: "Release",
    binaries: ["ripgrep"],
    changeLogCount: 18,
    homepage: "https://github.com/BurntSushi/ripgrep",
  },
  {
    name: "fd-find",
    description:
      "Simple, fast and user-friendly alternative to find — fd is a program to find entries in your filesystem.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "10.2.0-2",
    uploadDateTime: "2026-03-05T14:00:00Z",
    section: "utils",
    component: "universe",
    pocket: "Release",
    binaries: ["fd-find"],
  },
  {
    name: "fzf",
    description:
      "General-purpose command-line fuzzy finder — fzf is an interactive Unix filter for command-line that can be used with any list: files, command history, processes, hostnames, bookmarks, git commits, etc.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "0.55.0-1",
    uploadDateTime: "2026-02-28T11:00:00Z",
    section: "utils",
    component: "universe",
    pocket: "Release",
    binaries: ["fzf"],
    homepage: "https://github.com/junegunn/fzf",
  },
  // ---- web / server ---------------------------------------------------
  {
    name: "apache2",
    description:
      "Apache HTTP server — Apache 2 is a high-performance HTTP server with mod_event and HTTP/2 support, configured for Ubuntu's mpm_event default.",
    maintainerId: "omarFaruk",
    urgency: "High",
    latestVersion: "2.4.62-1ubuntu1",
    uploadDateTime: "2026-05-05T08:30:00Z",
    section: "httpd",
    component: "main",
    pocket: "Release",
    binaries: [
      "apache2",
      "apache2-bin",
      "apache2-utils",
      "apache2-data",
      "libapache2-mod-php8.4",
    ],
    changeLogCount: 218,
    homepage: "https://httpd.apache.org/",
    openBugCount: 17,
    cves: [
      {
        id: "CVE-2026-15001",
        title: "Information disclosure via Range header",
        severity: "medium",
        status: "released",
        publishedDate: "2026-03-12",
        affectedVersions: ["2.4.61-1ubuntu1"],
      },
    ],
  },
  {
    name: "lighttpd",
    description:
      "Fast webserver with minimal memory footprint — lighttpd is suitable for high-performance environments with limited resources.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "1.4.76-1ubuntu1",
    uploadDateTime: "2026-02-02T15:00:00Z",
    section: "httpd",
    component: "universe",
    pocket: "Release",
    binaries: ["lighttpd", "lighttpd-doc"],
    homepage: "https://www.lighttpd.net/",
  },
  {
    name: "haproxy",
    description:
      "Fast and reliable load balancing reverse proxy — HAProxy is a TCP/HTTP reverse proxy that is particularly suited for high availability environments.",
    maintainerId: "omarFaruk",
    urgency: "High",
    latestVersion: "3.0.6-1ubuntu1",
    uploadDateTime: "2026-04-09T07:45:00Z",
    section: "httpd",
    component: "main",
    pocket: "Release",
    binaries: ["haproxy", "haproxy-doc"],
    homepage: "https://www.haproxy.org/",
    openBugCount: 5,
  },
  {
    name: "caddy",
    description:
      "Fast, multi-platform web server with automatic HTTPS — Caddy provides automatic TLS certificates via Let's Encrypt and a simple Caddyfile config.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "2.8.4-2",
    uploadDateTime: "2026-04-18T09:00:00Z",
    section: "httpd",
    component: "universe",
    pocket: "Release",
    binaries: ["caddy"],
    homepage: "https://caddyserver.com/",
  },
  // ---- databases ------------------------------------------------------
  {
    name: "mariadb-server",
    description:
      "MariaDB database server (metapackage) — MariaDB is a fast, stable and true multi-platform database server that branched from MySQL.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "1:11.6.2-1ubuntu1",
    uploadDateTime: "2026-04-28T13:00:00Z",
    section: "database",
    component: "main",
    pocket: "Release",
    binaries: [
      "mariadb-server",
      "mariadb-client",
      "mariadb-common",
      "libmariadb3",
      "libmariadb-dev",
    ],
    changeLogCount: 168,
    homepage: "https://mariadb.org/",
    openBugCount: 22,
  },
  {
    name: "mysql-8.4",
    description:
      "MySQL 8.4 server, client tools, and shared libraries — packaged as a parallel-installable alternative to mariadb-server.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "8.4.3-1ubuntu1",
    uploadDateTime: "2026-04-15T10:00:00Z",
    section: "database",
    component: "universe",
    pocket: "Release",
    binaries: [
      "mysql-server-8.4",
      "mysql-client-8.4",
      "mysql-common",
      "libmysqlclient24",
    ],
    homepage: "https://www.mysql.com/",
  },
  {
    name: "redis",
    description:
      "Persistent key-value database with network interface — Redis is an open source, in-memory data structure store, used as a database, cache and message broker.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "5:7.4.1-2",
    uploadDateTime: "2026-03-18T08:30:00Z",
    section: "database",
    component: "main",
    pocket: "Release",
    binaries: ["redis-server", "redis-tools", "redis-sentinel", "redis-doc"],
    homepage: "https://redis.io/",
  },
  {
    name: "mongodb-org",
    description:
      "MongoDB document-oriented database (metapackage) — packages provided by MongoDB Inc. under the SSPL.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "8.0.4-1",
    uploadDateTime: "2026-03-02T16:00:00Z",
    section: "database",
    component: "multiverse",
    pocket: "Release",
    architectures: ["amd64", "arm64"],
    binaries: [
      "mongodb-org",
      "mongodb-org-server",
      "mongodb-org-shell",
      "mongodb-org-tools",
    ],
    homepage: "https://www.mongodb.com/",
  },
  {
    name: "sqlite3",
    description:
      "Command-line interface for SQLite 3 — SQLite is a C library that implements an SQL database engine.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "3.46.1-1",
    uploadDateTime: "2026-02-08T09:00:00Z",
    section: "database",
    component: "main",
    pocket: "Release",
    binaries: ["sqlite3", "libsqlite3-0", "libsqlite3-dev"],
    homepage: "https://sqlite.org/",
  },
  // ---- container / admin ----------------------------------------------
  {
    name: "docker.io",
    description:
      "Linux container runtime — docker.io provides the Docker daemon and CLI for building and managing OCI containers.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "27.4.0+dfsg2-1",
    uploadDateTime: "2026-05-01T12:00:00Z",
    section: "admin",
    component: "universe",
    pocket: "Release",
    binaries: [
      "docker.io",
      "docker-buildx-plugin",
      "docker-compose-plugin",
      "docker-doc",
    ],
    homepage: "https://www.docker.com/",
    openBugCount: 28,
  },
  {
    name: "containerd",
    description:
      "Industry-standard container runtime — containerd manages the complete container lifecycle of its host system, from image transfer and storage to container execution.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "1.7.24-1",
    uploadDateTime: "2026-04-25T11:00:00Z",
    section: "admin",
    component: "main",
    pocket: "Release",
    binaries: ["containerd", "containerd-shim-runc-v2"],
    homepage: "https://containerd.io/",
  },
  // ---- toolchains / compilers -----------------------------------------
  {
    name: "gcc-15",
    description:
      "GNU C compiler — gcc-15 is the default GCC version for the resolute development series.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "15.1.0-7ubuntu1",
    uploadDateTime: "2026-04-18T07:00:00Z",
    section: "devel",
    component: "main",
    pocket: "Release",
    binaries: [
      "gcc-15",
      "g++-15",
      "cpp-15",
      "libgcc-15-dev",
      "libstdc++-15-dev",
    ],
    changeLogCount: 421,
    homepage: "https://gcc.gnu.org/",
    openBugCount: 47,
  },
  {
    name: "llvm-19",
    description:
      "Modular compiler and toolchain technologies — LLVM is a collection of modular and reusable compiler and toolchain technologies.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "1:19.1.7-1ubuntu1",
    uploadDateTime: "2026-04-09T09:30:00Z",
    section: "devel",
    component: "universe",
    pocket: "Release",
    binaries: ["llvm-19", "llvm-19-dev", "llvm-19-tools", "llvm-19-runtime"],
    homepage: "https://llvm.org/",
  },
  {
    name: "clang-19",
    description:
      "C, C++ and Objective-C compiler (LLVM-based) — clang is a frontend for C-family languages built on top of LLVM.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "1:19.1.7-1ubuntu1",
    uploadDateTime: "2026-04-09T09:35:00Z",
    section: "devel",
    component: "universe",
    pocket: "Release",
    binaries: ["clang-19", "libclang-19-dev", "clangd-19", "clang-format-19"],
  },
  {
    name: "cmake",
    description:
      "Cross-platform, open-source make system — CMake is used to control the software compilation process using simple platform and compiler independent configuration files.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "3.30.5-2",
    uploadDateTime: "2026-03-15T10:00:00Z",
    section: "devel",
    component: "main",
    pocket: "Release",
    binaries: ["cmake", "cmake-data", "cmake-doc"],
    homepage: "https://cmake.org/",
  },
  {
    name: "make",
    description:
      "Utility for directing compilation — Make automatically determines which pieces of a large program need to be recompiled, and issues commands to recompile them.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "4.4.1-2",
    uploadDateTime: "2026-02-22T08:00:00Z",
    section: "devel",
    component: "main",
    pocket: "Release",
    binaries: ["make", "make-doc"],
  },
  {
    name: "ninja-build",
    description:
      "Small build system closest in spirit to Make — Ninja is a build system designed for speed.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "1.12.1-2",
    uploadDateTime: "2026-02-10T09:00:00Z",
    section: "devel",
    component: "main",
    pocket: "Release",
    binaries: ["ninja-build"],
  },
  {
    name: "gdb",
    description:
      "GNU Debugger — GDB allows you to see what is going on inside another program while it executes, or what another program was doing at the moment it crashed.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "15.2-2ubuntu1",
    uploadDateTime: "2026-04-05T13:00:00Z",
    section: "devel",
    component: "main",
    pocket: "Release",
    binaries: ["gdb", "gdb-doc", "gdbserver", "gdb-multiarch"],
  },
  {
    name: "rustc",
    description:
      "Rust systems programming language compiler — rustc is the compiler for the Rust language.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "1.86.0+dfsg-1ubuntu1",
    uploadDateTime: "2026-05-03T17:00:00Z",
    section: "devel",
    component: "universe",
    pocket: "Release",
    architectures: NO_ARMHF,
    binaries: ["rustc", "rust-src", "rust-doc", "cargo"],
    homepage: "https://www.rust-lang.org/",
    openBugCount: 14,
  },
  {
    name: "nodejs",
    description:
      "Event-based server-side JavaScript runtime — Node.js is built on Chrome's V8 JavaScript engine.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "22.14.0+dfsg1-1",
    uploadDateTime: "2026-04-30T08:00:00Z",
    section: "web",
    component: "universe",
    pocket: "Release",
    binaries: ["nodejs", "nodejs-doc", "libnode115"],
    homepage: "https://nodejs.org/",
    openBugCount: 19,
  },
  {
    name: "ruby3.3",
    description:
      "Interpreter of object-oriented scripting language Ruby (3.3 default version) — Ruby is the interpreted scripting language for quick and easy object-oriented programming.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "3.3.6-2",
    uploadDateTime: "2026-03-21T07:00:00Z",
    section: "ruby",
    component: "main",
    pocket: "Release",
    binaries: ["ruby3.3", "ruby3.3-dev", "libruby3.3", "ruby3.3-doc"],
    homepage: "https://www.ruby-lang.org/",
  },
  {
    name: "perl",
    description:
      "Larry Wall's Practical Extraction and Report Language — Perl is a high-level, general-purpose, interpreted, dynamic programming language.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "5.40.0-9",
    uploadDateTime: "2026-02-28T10:00:00Z",
    section: "perl",
    component: "main",
    pocket: "Release",
    binaries: ["perl", "perl-base", "perl-modules-5.40", "libperl5.40"],
    homepage: "https://www.perl.org/",
  },
  {
    name: "php8.4",
    description:
      "Server-side HTML-embedded scripting language (default PHP version) — PHP is a widely-used general-purpose scripting language.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "8.4.3-1ubuntu1",
    uploadDateTime: "2026-04-04T11:00:00Z",
    section: "php",
    component: "universe",
    pocket: "Release",
    binaries: [
      "php8.4",
      "php8.4-cli",
      "php8.4-fpm",
      "php8.4-common",
      "libapache2-mod-php8.4",
    ],
    homepage: "https://www.php.net/",
  },
  {
    name: "openjdk-25-jdk",
    description:
      "OpenJDK Development Kit (JDK) 25 — OpenJDK is the open-source implementation of the Java Platform, Standard Edition.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "25.0.1+9-1",
    uploadDateTime: "2026-04-30T06:00:00Z",
    section: "java",
    component: "main",
    pocket: "Release",
    binaries: [
      "openjdk-25-jdk",
      "openjdk-25-jre",
      "openjdk-25-jre-headless",
      "openjdk-25-doc",
      "openjdk-25-source",
    ],
  },
  {
    name: "lua5.4",
    description:
      "Powerful, fast, lightweight, embeddable scripting language — Lua is a small, embeddable scripting language.",
    maintainerId: "kaiTanaka",
    urgency: "Low",
    latestVersion: "5.4.7-2",
    uploadDateTime: "2026-01-12T13:00:00Z",
    section: "interpreters",
    component: "universe",
    pocket: "Release",
    binaries: ["lua5.4", "liblua5.4-0", "liblua5.4-dev"],
    homepage: "https://www.lua.org/",
  },
  {
    name: "golang-1.24",
    description:
      "Go programming language 1.24 toolchain — Go is an open-source programming language that makes it easy to build simple, reliable, and efficient software.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "1.24.1-1",
    uploadDateTime: "2026-05-04T08:00:00Z",
    section: "devel",
    component: "universe",
    pocket: "Release",
    binaries: [
      "golang-1.24",
      "golang-1.24-src",
      "golang-1.24-doc",
      "golang-1.24-go",
    ],
    homepage: "https://go.dev/",
  },
  // ---- core system ----------------------------------------------------
  {
    name: "systemd",
    description:
      "System and service manager — systemd is a suite of basic building blocks for a Linux system.",
    maintainerId: "ninaHolt",
    urgency: "High",
    latestVersion: "256.7-2ubuntu1",
    uploadDateTime: "2026-05-06T09:00:00Z",
    section: "admin",
    component: "main",
    pocket: "Release",
    binaries: [
      "systemd",
      "systemd-sysv",
      "libsystemd0",
      "libsystemd-shared",
      "udev",
      "libudev1",
    ],
    changeLogCount: 502,
    homepage: "https://systemd.io/",
    openBugCount: 71,
  },
  {
    name: "dbus",
    description:
      "Simple interprocess messaging system — D-Bus is a message bus system, a simple way for applications to talk to one another.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "1.16.0-2ubuntu1",
    uploadDateTime: "2026-04-12T08:00:00Z",
    section: "admin",
    component: "main",
    pocket: "Release",
    binaries: [
      "dbus",
      "dbus-bin",
      "dbus-daemon",
      "libdbus-1-3",
      "libdbus-1-dev",
    ],
    homepage: "https://www.freedesktop.org/wiki/Software/dbus/",
  },
  {
    name: "network-manager",
    description:
      "Network management framework (daemon and userspace tools) — NetworkManager attempts to keep an active network connection available at all times.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "1.50.0-2ubuntu1",
    uploadDateTime: "2026-04-22T11:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: [
      "network-manager",
      "libnm0",
      "network-manager-config-connectivity-ubuntu",
    ],
    homepage: "https://wiki.gnome.org/Projects/NetworkManager",
  },
  // ---- network --------------------------------------------------------
  {
    name: "sudo",
    description:
      "Provide limited super user privileges to specific users — sudo lets you execute commands as another user, typically root, with optional authentication.",
    maintainerId: "omarFaruk",
    urgency: "High",
    latestVersion: "1.9.16p2-1ubuntu1",
    uploadDateTime: "2026-03-30T13:30:00Z",
    section: "admin",
    component: "main",
    pocket: "Security",
    binaries: ["sudo", "sudo-ldap"],
    homepage: "https://www.sudo.ws/",
    openBugCount: 6,
    cves: [
      {
        id: "CVE-2026-22001",
        title: "Local privilege escalation via Runas_Spec parsing",
        severity: "high",
        status: "released",
        publishedDate: "2026-03-26",
        affectedVersions: ["1.9.15-3ubuntu1"],
      },
    ],
  },
  {
    name: "ufw",
    description:
      "Program for managing a Netfilter firewall — UFW (Uncomplicated Firewall) is a frontend for iptables and is particularly well-suited for host-based firewalls.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "0.36.2-9",
    uploadDateTime: "2026-02-09T15:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: ["ufw"],
  },
  {
    name: "openssh-server",
    description:
      "Secure shell (SSH) server, for secure access from remote machines — OpenSSH is a free version of the SSH connectivity tools.",
    maintainerId: "omarFaruk",
    urgency: "High",
    latestVersion: "1:9.9p2-2",
    uploadDateTime: "2026-04-26T07:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: [
      "openssh-server",
      "openssh-client",
      "openssh-sftp-server",
      "openssh-known-hosts",
    ],
    homepage: "https://www.openssh.com/",
    openBugCount: 11,
  },
  {
    name: "openvpn",
    description:
      "Virtual Private Network daemon — OpenVPN is an application to securely tunnel IP networks over a single UDP or TCP port.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "2.6.13-1ubuntu1",
    uploadDateTime: "2026-03-19T11:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: ["openvpn"],
    homepage: "https://openvpn.net/",
  },
  {
    name: "wireguard",
    description:
      "Fast, modern, secure VPN tunnel — WireGuard is an extremely simple yet fast and modern VPN that uses state-of-the-art cryptography.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "1.0.20210914-2",
    uploadDateTime: "2026-02-26T10:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: ["wireguard", "wireguard-tools"],
    homepage: "https://www.wireguard.com/",
  },
  {
    name: "nmap",
    description:
      "The Network Mapper — Nmap is a security/network exploration tool and port-scanner.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "7.95+dfsg-1",
    uploadDateTime: "2026-03-12T12:00:00Z",
    section: "net",
    component: "universe",
    pocket: "Release",
    binaries: ["nmap", "ncat", "ndiff", "zenmap"],
    homepage: "https://nmap.org/",
  },
  {
    name: "bind9",
    description:
      "Internet Domain Name Server — BIND 9 is a leading implementation of the Domain Name System protocols.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "1:9.20.4-1ubuntu1",
    uploadDateTime: "2026-04-15T08:00:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: ["bind9", "bind9-utils", "bind9-host", "libbind9-9"],
    homepage: "https://www.isc.org/bind/",
  },
  {
    name: "dnsutils",
    description:
      "Clients provided with BIND — dig, host, nslookup, and the other DNS-related utilities.",
    maintainerId: "ninaHolt",
    urgency: "Low",
    latestVersion: "1:9.20.4-1ubuntu1",
    uploadDateTime: "2026-04-15T08:15:00Z",
    section: "net",
    component: "main",
    pocket: "Release",
    binaries: ["dnsutils"],
  },
  // ---- kernel / boot --------------------------------------------------
  {
    name: "linux",
    description:
      "Linux kernel source tree — produces linux-image-generic and the matching headers/modules for Ubuntu's generic flavour.",
    maintainerId: "avaNovak",
    urgency: "Critical",
    latestVersion: "6.14.0-15.15",
    uploadDateTime: "2026-05-08T05:30:00Z",
    section: "kernel",
    component: "main",
    pocket: "Security",
    binaries: [
      "linux-image-generic",
      "linux-headers-generic",
      "linux-tools-generic",
      "linux-modules-extra-6.14.0-15-generic",
    ],
    changeLogCount: 1244,
    homepage: "https://kernel.org/",
    openBugCount: 412,
    cves: [
      {
        id: "CVE-2026-30001",
        title: "Use-after-free in netfilter NFT_LIST",
        severity: "high",
        status: "released",
        publishedDate: "2026-05-04",
        affectedVersions: ["6.14.0-14.14"],
      },
    ],
  },
  {
    name: "grub2",
    description:
      "GRand Unified Bootloader, version 2 — GRUB is a portable, powerful bootloader.",
    maintainerId: "avaNovak",
    urgency: "High",
    latestVersion: "2.12-7ubuntu1",
    uploadDateTime: "2026-04-25T07:00:00Z",
    section: "admin",
    component: "main",
    pocket: "Release",
    binaries: ["grub-pc", "grub-efi-amd64", "grub-common", "grub2-common"],
  },
  {
    name: "systemd-boot",
    description:
      "Simple UEFI boot manager (from the systemd suite) — packaged separately so it can coexist with grub2.",
    maintainerId: "ninaHolt",
    urgency: "Medium",
    latestVersion: "256.7-2ubuntu1",
    uploadDateTime: "2026-05-06T09:30:00Z",
    section: "admin",
    component: "universe",
    pocket: "Release",
    architectures: NO_ARMHF,
    binaries: ["systemd-boot", "systemd-boot-efi"],
  },
  // ---- multimedia -----------------------------------------------------
  {
    name: "ffmpeg",
    description:
      "Tools for transcoding, streaming and playing of multimedia files — FFmpeg is a complete, cross-platform solution to record, convert and stream audio and video.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "7:7.1-3ubuntu1",
    uploadDateTime: "2026-04-21T13:00:00Z",
    section: "video",
    component: "universe",
    pocket: "Release",
    binaries: [
      "ffmpeg",
      "libavcodec61",
      "libavformat61",
      "libavutil59",
      "libswscale8",
      "libavfilter10",
    ],
    homepage: "https://www.ffmpeg.org/",
    openBugCount: 33,
  },
  {
    name: "mpv",
    description:
      "Video player based on MPlayer/mplayer2 — mpv is a free media player that supports a wide variety of video file formats, audio and video codecs, and subtitle types.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "0.39.0-4",
    uploadDateTime: "2026-03-08T18:00:00Z",
    section: "video",
    component: "universe",
    pocket: "Release",
    binaries: ["mpv", "libmpv2"],
    homepage: "https://mpv.io/",
  },
  {
    name: "vlc",
    description:
      "Multimedia player and streamer — VLC media player is a free and open source cross-platform multimedia player and framework.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "3.0.21-3ubuntu1",
    uploadDateTime: "2026-03-22T15:00:00Z",
    section: "video",
    component: "universe",
    pocket: "Release",
    binaries: ["vlc", "vlc-bin", "vlc-data", "libvlc5"],
    homepage: "https://www.videolan.org/vlc/",
  },
  {
    name: "gstreamer1.0",
    description:
      "GStreamer 1.0 core libraries and elements — GStreamer is a streaming media framework.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "1.24.10-1ubuntu1",
    uploadDateTime: "2026-04-10T09:00:00Z",
    section: "libs",
    component: "main",
    pocket: "Release",
    binaries: [
      "libgstreamer1.0-0",
      "gstreamer1.0-tools",
      "gstreamer1.0-plugins-base",
      "gstreamer1.0-plugins-good",
    ],
  },
  // ---- desktop --------------------------------------------------------
  {
    name: "gnome-shell",
    description:
      "Graphical shell for the GNOME desktop — GNOME Shell provides core user-interface functions for the GNOME 3 desktop, like switching to windows and launching applications.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "47.2-1ubuntu1",
    uploadDateTime: "2026-04-30T11:00:00Z",
    section: "gnome",
    component: "main",
    pocket: "Release",
    binaries: ["gnome-shell", "gnome-shell-common", "gnome-shell-extensions"],
    homepage: "https://wiki.gnome.org/Projects/GnomeShell",
    openBugCount: 96,
  },
  {
    name: "gnome-terminal",
    description:
      "GNOME terminal emulator application — GNOME Terminal is a terminal emulator for the GNOME desktop environment.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "3.54.2-1",
    uploadDateTime: "2026-03-19T16:00:00Z",
    section: "gnome",
    component: "main",
    pocket: "Release",
    binaries: ["gnome-terminal", "gnome-terminal-data"],
  },
  {
    name: "nautilus",
    description:
      "File manager for GNOME desktop — Nautilus is the file manager for the GNOME desktop.",
    maintainerId: "avaNovak",
    urgency: "Medium",
    latestVersion: "47.2-1ubuntu1",
    uploadDateTime: "2026-04-08T11:00:00Z",
    section: "gnome",
    component: "main",
    pocket: "Release",
    binaries: ["nautilus", "nautilus-data", "libnautilus-extension4"],
  },
  {
    name: "gedit",
    description:
      "Official text editor of the GNOME desktop environment — gedit is a small and lightweight UTF-8 text editor with GNOME look and feel.",
    maintainerId: "avaNovak",
    urgency: "Low",
    latestVersion: "47.2-1ubuntu1",
    uploadDateTime: "2026-03-15T13:00:00Z",
    section: "gnome",
    component: "universe",
    pocket: "Release",
    binaries: ["gedit", "gedit-common"],
  },
  // ---- core libs ------------------------------------------------------
  {
    name: "openssl",
    description:
      "Secure Sockets Layer toolkit — cryptography-related utilities and the libssl/libcrypto shared libraries.",
    maintainerId: "omarFaruk",
    urgency: "Critical",
    latestVersion: "3.4.0-1ubuntu1",
    uploadDateTime: "2026-04-29T08:00:00Z",
    section: "libs",
    component: "main",
    pocket: "Security",
    binaries: ["openssl", "libssl3", "libcrypto3", "libssl-dev"],
    homepage: "https://www.openssl.org/",
    openBugCount: 9,
    cves: [
      {
        id: "CVE-2026-19001",
        title: "Memory disclosure in TLS 1.3 session ticket decryption",
        severity: "high",
        status: "released",
        publishedDate: "2026-04-28",
        affectedVersions: ["3.3.2-2ubuntu1"],
      },
    ],
  },
  {
    name: "ca-certificates",
    description:
      "Common CA certificates — Contains the certificate authorities shipped with Mozilla's browser to allow SSL-based applications to check for authenticity.",
    maintainerId: "omarFaruk",
    urgency: "Medium",
    latestVersion: "20240903ubuntu1",
    uploadDateTime: "2026-04-29T08:30:00Z",
    section: "libs",
    component: "main",
    pocket: "Updates",
    architectures: ["all"],
    binaries: ["ca-certificates"],
  },
  {
    name: "glibc",
    description:
      "GNU C Library: shared libraries — glibc is the GNU implementation of the standard C library.",
    maintainerId: "kaiTanaka",
    urgency: "High",
    latestVersion: "2.41-3ubuntu1",
    uploadDateTime: "2026-05-07T07:00:00Z",
    section: "libs",
    component: "main",
    pocket: "Release",
    binaries: ["libc6", "libc6-dev", "libc-bin", "libc-l10n", "locales"],
    architectures: DEFAULT_ARCHES,
    homepage: "https://www.gnu.org/software/libc/",
    openBugCount: 38,
  },
  {
    name: "zlib",
    description:
      "Compression library — Runtime — zlib is a general-purpose, patent-free, lossless data-compression library.",
    maintainerId: "kaiTanaka",
    urgency: "Medium",
    latestVersion: "1:1.3.1.dfsg-3.1ubuntu1",
    uploadDateTime: "2026-03-04T09:00:00Z",
    section: "libs",
    component: "main",
    pocket: "Release",
    binaries: ["zlib1g", "zlib1g-dev"],
  },
];

const seriesNobleVersionDefault = (latestVersion: string): string => {
  // Crude fallback: keep the upstream component, drop the ubuntu suffix and
  // bump it down by one. Used only when an extra spec doesn't supply its own
  // noble version override.
  if (latestVersion.includes("ubuntu")) {
    return latestVersion.replace(
      /-(\d+)ubuntu\d+(?:\.\d+)?$/,
      "-$1ubuntu0~24.04",
    );
  }
  return `${latestVersion}~24.04`;
};

const DESCRIPTION_MIN_LENGTH = 300;

// Compact specs typically run 80–180 chars; pad with a synthesized tail so
// every description is long enough to exercise the page's "Show more" cutoff.
const padDescription = (spec: ExtraSpec): string => {
  if (spec.description.length >= DESCRIPTION_MIN_LENGTH)
    return spec.description;
  const binaries = spec.binaries.join(", ");
  const archCount = (spec.architectures ?? DEFAULT_ARCHES).length;
  const tail = `In Ubuntu, ${spec.name} sits in the ${spec.section} section of the ${spec.component} component and is published across ${archCount} architectures. The source produces ${spec.binaries.length} binary package${spec.binaries.length === 1 ? "" : "s"}: ${binaries}. Updates land via the ${spec.pocket.toLowerCase()} pocket.`;
  return `${spec.description}\n\n${tail}`;
};

export const makeExtraSeed = (spec: ExtraSpec): SourcePackageSeed => {
  const arches: Architecture[] = spec.architectures ?? DEFAULT_ARCHES;
  const maintainer = MAINTAINERS[spec.maintainerId];
  const uploader = spec.uploader ?? spec.maintainerId;
  const nobleVersion =
    spec.nobleVersion ?? seriesNobleVersionDefault(spec.latestVersion);
  const nobleUploader = spec.nobleUploader ?? uploader;
  const nobleUploadDate = spec.nobleUploadDate ?? "2025-11-01T12:00:00Z";

  const versions: SourcePackageSeed["versions"] = [
    {
      version: spec.latestVersion,
      series: "resolute",
      status: "Published",
      pocket: spec.pocket,
      component: spec.component,
      section: spec.section,
      uploadDateTime: spec.uploadDateTime,
      uploader,
      publishedOn: spec.uploadDateTime.slice(0, 10),
      isCurrent: true,
      builds: arches
        .filter((a) => a !== "all")
        .map((name) => ({
          name,
          status: "success" as const,
        })),
    },
    {
      version: nobleVersion,
      series: "noble",
      status: "Published",
      pocket: spec.noblePocket ?? "Updates",
      component: spec.component,
      section: spec.section,
      uploadDateTime: nobleUploadDate,
      uploader: nobleUploader,
      publishedOn: nobleUploadDate.slice(0, 10),
      isCurrent: true,
    },
  ];

  const binariesArtifacts: SourcePackageBinariesGroup["artifacts"] =
    spec.binaries.flatMap((name) => {
      const archesForArtifact = arches.includes("amd64")
        ? ["amd64"]
        : [arches[0]];
      return (archesForArtifact as Architecture[]).map((arch) => ({
        id: `${name}-resolute-${arch}-release`,
        name,
        version: spec.latestVersion,
        architecture: arch,
        status: "Published" as PublishingStatus,
      }));
    });

  const paddedDescription = padDescription(spec);

  return {
    details: {
      id: spec.name,
      name: spec.name,
      description: paddedDescription,
      maintainer,
      urgency: spec.urgency,
      architectures: arches,
      openBugCount: spec.openBugCount ?? 0,
      openQuestionsCount: spec.openQuestionsCount ?? 0,
      changeLogCount: spec.changeLogCount ?? 1,
    },
    listing: {
      status: "Published",
      pocket: spec.pocket,
      component: spec.component,
      latestVersionId: `${spec.name}-${versionSlug(spec.latestVersion)}`,
      seriesKey: "resolute",
    },
    latestVersion: spec.latestVersion,
    versions,
    binaryPackageNames: spec.binaries,
    binariesGroup: {
      title: `${spec.name} binary packages`,
      description: spec.binariesDescription ?? paddedDescription,
      artifacts: binariesArtifacts,
    },
    relationships: {
      dependedOn: spec.dependedOn ?? [],
      recommends: spec.recommends ?? [],
      suggests: spec.suggests ?? [],
      conflicts: spec.conflicts ?? [],
      dependedBy: spec.dependedBy ?? [],
      recommendedBy: [],
      suggestedBy: [],
    },
    ppaVersions: spec.ppaVersions ?? [],
    bugs: spec.bugs ?? [],
    cves: spec.cves ?? [],
    mergeProposals: [],
    upstream: {
      homepage: spec.homepage,
      repositoryUrl: spec.repositoryUrl,
      bugTrackerUrl: spec.bugTrackerUrl,
      contacts: spec.upstreamContacts ?? [],
    },
    debian: {
      trackerUrl: `https://tracker.debian.org/pkg/${spec.name}`,
      btsUrl: `https://bugs.debian.org/cgi-bin/pkgreport.cgi?pkg=${spec.name}`,
      openBugCount: spec.debianOpenBugCount,
    },
    source: {
      distribution: "ubuntu",
      packageName: spec.name,
      url: lp(`/ubuntu/+source/${spec.name}`),
    },
    versionUpstream: spec.homepage
      ? [{ name: spec.name, url: spec.homepage }]
      : [],
  };
};
