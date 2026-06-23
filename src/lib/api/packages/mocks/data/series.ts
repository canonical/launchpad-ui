import type { Series } from "../../types.js";

export const SERIES = {
  resolute: {
    id: "resolute",
    name: "resolute",
    displayName: "26.04 LTS Resolute",
    version: "26.04",
  },
  noble: {
    id: "noble",
    name: "noble",
    displayName: "24.04 LTS Noble",
    version: "24.04",
  },
  jammy: {
    id: "jammy",
    name: "jammy",
    displayName: "22.04 LTS Jammy",
    version: "22.04",
  },
  focal: {
    id: "focal",
    name: "focal",
    displayName: "20.04 LTS Focal",
    version: "20.04",
  },
} as const satisfies Record<string, Series & { id: string }>;

export type SeriesKey = keyof typeof SERIES;
