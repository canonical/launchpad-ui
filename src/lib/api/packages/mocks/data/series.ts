import type { Series } from "../../types.js";

export const SERIES = {
  resolute: {
    id: "resolute",
    name: "resolute",
    displayName: "Resolute",
    title: "The Resolute Razorbill",
    version: "26.04",
  },
  noble: {
    id: "noble",
    name: "noble",
    displayName: "Noble",
    title: "The Noble Numbat",
    version: "24.04",
  },
  jammy: {
    id: "jammy",
    name: "jammy",
    displayName: "Jammy",
    title: "The Jammy Jellyfish",
    version: "22.04",
  },
  focal: {
    id: "focal",
    name: "focal",
    displayName: "Focal",
    title: "The Focal Fossa",
    version: "20.04",
  },
} as const satisfies Record<string, Series & { id: string }>;

export type SeriesKey = keyof typeof SERIES;
