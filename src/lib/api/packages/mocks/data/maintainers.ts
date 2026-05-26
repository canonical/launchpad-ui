import type { Maintainer } from "../../types.js";

export const MAINTAINERS = {
  ubuntuDevelopers: {
    id: "ubuntu-developers",
    name: "Ubuntu Developers",
    profileIcon: "https://launchpad.net/~ubuntu-devel-discuss/+icon",
    url: "https://launchpad.net/~ubuntu-devel-discuss",
  },
  sebastienBacher: {
    id: "seb128",
    name: "Sebastien Bacher",
    profileIcon: "https://launchpad.net/~seb128/+icon",
    url: "https://launchpad.net/~seb128",
  },
  matthiasKlose: {
    id: "doko",
    name: "Matthias Klose",
    profileIcon: "https://launchpad.net/~doko/+icon",
    url: "https://launchpad.net/~doko",
  },
  martinPitt: {
    id: "pitti",
    name: "Martin Pitt",
    profileIcon: "https://launchpad.net/~pitti/+icon",
    url: "https://launchpad.net/~pitti",
  },
  iainLane: {
    id: "laney",
    name: "Iain Lane",
    profileIcon: "https://launchpad.net/~laney/+icon",
    url: "https://launchpad.net/~laney",
  },
} as const satisfies Record<string, Maintainer>;
