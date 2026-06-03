import type { Maintainer } from "../../types.js";

// Fictional maintainers
export const MAINTAINERS = {
  ubuntuDevelopers: {
    id: "ubuntu-developers",
    name: "Ubuntu Developers",
    profileIcon: "https://launchpad.net/~ubuntu-devel-discuss/+icon",
    url: "https://launchpad.net/~ubuntu-devel-discuss",
  },
  avaNovak: {
    id: "anovak",
    name: "Ava Novak",
    profileIcon: "https://launchpad.net/~anovak/+icon",
    url: "https://launchpad.net/~anovak",
  },
  kaiTanaka: {
    id: "ktanaka",
    name: "Kai Tanaka",
    profileIcon: "https://launchpad.net/~ktanaka/+icon",
    url: "https://launchpad.net/~ktanaka",
  },
  ninaHolt: {
    id: "nholt",
    name: "Nina Holt",
    profileIcon: "https://launchpad.net/~nholt/+icon",
    url: "https://launchpad.net/~nholt",
  },
  omarFaruk: {
    id: "ofaruk",
    name: "Omar Faruk",
    profileIcon: "https://launchpad.net/~ofaruk/+icon",
    url: "https://launchpad.net/~ofaruk",
  },
} as const satisfies Record<string, Maintainer>;
