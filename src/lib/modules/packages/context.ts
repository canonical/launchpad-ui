import { createContext } from "svelte";
import type { BoundPackagesQueryParams } from "./superhref.js";

export const [getPackagesContext, setPackagesContext] = createContext<{
  readonly queryParams: BoundPackagesQueryParams;
}>();
