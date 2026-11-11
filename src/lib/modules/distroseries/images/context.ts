import { createContext } from "svelte";
import type { QueryParams } from "./superhref.js";

export const [getImagesContext, setImagesContext] = createContext<{
  readonly distro: string;
  readonly queryParams: ReturnType<typeof QueryParams.bind>;
}>();
